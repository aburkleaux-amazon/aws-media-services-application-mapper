/*! Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
       SPDX-License-Identifier: Apache-2.0 */

define(["jquery", "lodash", "app/model", "app/events", "app/ui/diagrams"],
    function($, _, model, event_alerts, diagrams) {

        var updateEventAlertState = function(current_alerts, previous_alerts) {
            // iterate through current 'set' alerts
            var alerting_nodes = [];
            var inactive_nodes = [];
            for (let item of current_alerts) {
                var node = model.nodes.get(item.resource_arn);
                if (node) {
                    node.alerting = true;
                    // track which nodes are signaling an alert
                    if (!alerting_nodes.includes(item.resource_arn)) {
                        alerting_nodes.push(item.resource_arn);
                        // console.log("setting alert color for " + node.id);
                        var selected = node.render.alert_selected();
                        var unselected = node.render.alert_unselected();
                        if (selected != node.image.selected || unselected != node.image.unselected) {
                            node.image.selected = selected;
                            node.image.unselected = unselected;
                            model.nodes.update(node);
                            var matches = diagrams.have_all([node.id]);
                            // console.log(matches);
                            for (let diagram of matches) {
                                diagram.nodes.update(node);
                                diagram.alert(true);
                            }
                        }
                    }
                }
            }

            // calculate the current alerts not included in the previous alerts
            for (let previous of previous_alerts) {
                var found = false;
                for (let arn of alerting_nodes) {
                    found = found || arn == previous.resource_arn;
                    if (found) {
                        break;
                    }
                }
                if (!found) {
                    inactive_nodes.push(previous.resource_arn);
                }
            }

            // 'unalert' the nodes that are no longer alerting
            for (let arn of inactive_nodes) {
                var node = model.nodes.get(arn);
                if (node) {
                    node.alerting = false;
                    var selected = node.render.normal_selected();
                    var unselected = node.render.normal_unselected();
                    if (selected != node.image.selected || unselected != node.image.unselected) {
                        node.image.selected = selected;
                        node.image.unselected = unselected;
                        model.nodes.update(node);
                        var matches = diagrams.have_all([node.id]);
                        // console.log(matches);
                        for (let diagram of matches) {
                            diagram.nodes.update(node);
                            diagram.alert(false);
                        }
                    }
                }
            }
        };

        event_alerts.add_callback(updateEventAlertState);
    });