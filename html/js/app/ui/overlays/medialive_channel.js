/*! Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
       SPDX-License-Identifier: Apache-2.0 */

define(["jquery", "lodash", "app/events", "app/alarms", "app/ui/overlays/overlay_tools", "app/model"],
    function($, _, alert_events, alarms, tools, model) {

        var match_type = "MediaLive Channel";

        var decorate_alarms = function(drawing, font_size, width, height, id) {
            var alarm_count = 0;
            for (let item of alarms.get_subscribers_with_alarms().current) {
                if (item.ResourceArn == id) {
                    alarm_count += item.AlarmCount;
                }
            }
            tools.set_alarm_text("Active alarms: " + alarm_count, drawing, font_size, width);
        };

        var decorate_events = function(drawing, font_size, width, height, id) {
            // console.log(id);
            var pipeline_alerts = [0, 0];
            for (let item of alert_events.get_cached_events().current) {
                // console.log(item);
                if (item.resource_arn == id) {
                    pipeline_alerts[parseInt(item.detail.pipeline)] += 1;
                }
            }
            tools.set_event_text("Pipeline alerts: " + JSON.stringify(pipeline_alerts), drawing, font_size, width);
        };

        var decorate_information = function(drawing, font_size, width, height, id) {
            // var node = await model.update(id);
            // return new Promise(function(resolve, reject) {
            //     model.update(id).then(function(node) {
            // var node = model.nodes.get(id);
            // if (node) {
            //     var state = node.data.State;
            //     tools.set_info_text("State: " + state, drawing, font_size, width);
            // }
        };

        var decorate = function(drawing, font_size, width, height, id) {
            decorate_alarms(drawing, font_size, width, height, id);
            decorate_events(drawing, font_size, width, height, id);
            decorate_information(drawing, font_size, width, height, id);
        };

        return {
            "match_type": match_type,
            "decorate": decorate,
            "informational": true
        };

    });