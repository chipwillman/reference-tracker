var Timeline = {
    formatDate: function (date) {
        if (!date) return date;
        var circa = date.indexOf("c ") >= 0;
        var day = 20;
        var month = 3;
        var year = 1;
        if (circa) {
            var yearString = date.substring(2);
            if (yearString.indexOf("bc") >= 0) {
                year = -parseInt(yearString.substring(0, yearString.indexOf("bc")));
            } else {
                year = parseInt(yearString);
            }
        } else {
            var parts = date.split("-");
            if (parts.length >= 3) {
                if (parts[0].indexOf("bc") >= 0) {
                    year = parseInt(parts[0].substring(0, parts[0].indexOf("bc")));
                } else {
                    year = parseInt(parts[0]);
                }
                month = parseInt(parts[1]) - 1;
                day = parseInt(parts[2]);
            }
        }
        return new Date(year, month, day);
    },
    createViewpoints: function() {
        var timeline = [];
        for(var i = 0; i < EditorEvents.viewpoints.length; i++) {
            var viewpoint = EditorEvents.viewpoints[i];
            timeline.push({
                id: viewpoint.ViewPointId,
                content: viewpoint.Name,
                start: Timeline.formatDate(viewpoint.BeginDate),
                group: 0,
                end: null //Timeline.formatDate(viewpoint.EndDate)
            });
        }

        for (var i = 0; i < EditorEvents.hypothesis.length; i++) {
            var hypothesis = EditorEvents.hypothesis[i];
            timeline.push({
                id: hypothesis.HypothesisId,
                content: hypothesis.Name,
                start: Timeline.formatDate(hypothesis.BeginDate),
                group: hypothesis.FactionId
            });
        }

        return new vis.DataSet(timeline);
    },
    createTimeline: function() {
        var container = document.getElementById('timelineContent');
        container.innerHTML = "";
        if (EditorEvents.viewpoints.length > 0) {
            var items = Timeline.createViewpoints();
            var options = {
                width: '100%',
                start: new Date(300, 1, 1),
                end: new Date(1200, 1, 1),
                groupOrder: 'content'
            };
            var timeline = new vis.Timeline(container, items, options);
            var groups = new vis.DataSet();
            groups.add({ id: 0, content: "Mainstream" });
            for (var i = 0; i < EditorEvents.factions.length; i++) {
                var faction = EditorEvents.factions[i];
                if (faction.selected) {
                    groups.add({ id: faction.FactionId, content: faction.Name });
                }
            }
            timeline.setGroups(groups);

            /**
             * Move the timeline a given percentage to left or right
             * @param {Number} percentage   For example 0.1 (left) or -0.1 (right)
             */
            function move(percentage) {
                var range = timeline.getWindow();
                var interval = range.end - range.start;

                timeline.setWindow({
                    start: range.start.valueOf() - interval * percentage,
                    end: range.end.valueOf() - interval * percentage
                });
            }

            // attach events to the navigation buttons
            document.getElementById('zoomIn').onclick = function() { timeline.zoomIn(0.2); };
            document.getElementById('zoomOut').onclick = function() { timeline.zoomOut(0.2); };
            document.getElementById('moveLeft').onclick = function() { move(0.2); };
            document.getElementById('moveRight').onclick = function() { move(-0.2); };
            document.getElementById('toggleRollingMode').onclick = function() { timeline.toggleRollingMode() };
        }
    },
    viewpointsChanged: function () {
        Timeline.createTimeline();
    }
}


EditorEvents.viewpointsChanged = Timeline.viewpointsChanged;
