#include <math.h>
#include <sys/cdefs.h>
#include "sc_logic.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include <freertos/task.h>
#include "compass_data.h"

// Defines
#define TAG "SC_LOGIC"
#define NODE_DETECTION_PRECISION_M 5
#define BEARING_OFFSET_DEGREES 0

compass_data_t *compass_data_ptr;
display_data_t *display_data_ptr;

static void calculate_lat_lon(float * lat_km, float * lon_km) {
    float lon_diff = compass_data_ptr->path.nodes[display_data_ptr->next_wp].lon - compass_data_ptr->position.lon;
    float lat_diff = compass_data_ptr->path.nodes[display_data_ptr->next_wp].lat - compass_data_ptr->position.lat;

    *lat_km = lat_diff * 110.574;
    *lon_km = lon_diff * 111.320*cos(compass_data_ptr->path.nodes[display_data_ptr->next_wp].lat * M_PI / 180);
}

static int16_t calculate_angle() {
    
    float curr_lon = compass_data_ptr->position.lon * M_PI / 180;
    float curr_lat = compass_data_ptr->position.lat * M_PI / 180;
    float goal_lon = compass_data_ptr->path.nodes[display_data_ptr->next_wp].lon * M_PI / 180;
    float goal_lat = compass_data_ptr->path.nodes[display_data_ptr->next_wp].lat * M_PI / 180;

    float dLon = (goal_lon - curr_lon);

    float y = sin(dLon) * cos(goal_lat);
    float x = cos(goal_lat) * sin(goal_lat) - sin(curr_lat)
            * cos(goal_lat) * cos(dLon);

    float bearing = atan2(y, x);

    int16_t angle = (bearing * 1800 / M_PI);
    angle = (angle + 3600) % 3600;
    float bearing_angle = compass_data_ptr->bearing * (1800.0 / 65536.0);
    int16_t bearing_angle_final = (int16_t)(bearing_angle + BEARING_OFFSET_DEGREES * 10 + 3600) % 3600;
    return (angle - bearing_angle_final + 3600) % 3600;
}

static uint16_t calculate_next_wp() {
    if (display_data_ptr->distance > NODE_DETECTION_PRECISION_M) {
      return display_data_ptr->next_wp; 
    } 
    if (display_data_ptr->next_wp+1 >= compass_data_ptr->path.length) {
      return display_data_ptr->next_wp;
    }
    return display_data_ptr->next_wp+1;
}

static uint16_t calculate_distance() {
    float lon_diff = compass_data_ptr->path.nodes[display_data_ptr->next_wp].lon - compass_data_ptr->position.lon;
    float lat_diff = compass_data_ptr->path.nodes[display_data_ptr->next_wp].lat - compass_data_ptr->position.lat;

    float lat_km = lat_diff * 110.574;
    float lon_km = lon_diff * 111.320*cos(compass_data_ptr->path.nodes[display_data_ptr->next_wp].lat * M_PI / 180);
    
    return (uint32_t) (sqrt(lat_km * lat_km + lon_km * lon_km) * 1000);
}

_Noreturn static void logic_task() {
    ESP_LOGI(TAG, "logic_task");
    compass_data_ptr = &compass_data;
    display_data_ptr = &display_data;
    while (1) {
        // Obtain semaphore 1
        if (xSemaphoreTake(compass_data_ptr->mutex, portMAX_DELAY) == pdTRUE) {
            // Obtain semaphore 2
            if (xSemaphoreTake(display_data_ptr->mutex, portMAX_DELAY) == pdTRUE) {
                // Update display data
                display_data_ptr->angle = calculate_angle();
                display_data_ptr->distance = calculate_distance();
                display_data_ptr->next_wp = calculate_next_wp();
                // Release semaphore 2
                xSemaphoreGive(display_data_ptr->mutex);
            }
            // Release semaphore 1
            xSemaphoreGive(compass_data_ptr->mutex);
        }
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}

void sc_logic_init() {
    xTaskCreate(logic_task, "logic_task", 2048, NULL, 5, NULL);
}
