var ViewpointViewer = {
    createViewpoints: function () {
        var timeline = [];
        for (var i = 0; i < EditorEvents.viewpoints.length; i++) {
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

        return timeline;
    },

    createViewpoint: function () {
        var container = document.getElementById('#springydemo');
        container.innerHTML = "";
        if (EditorEvents.viewpoints.length > 0) {
            var graph = new Springy.Graph();
            graph.addNodes('Dennis', 'Michael', 'Jessica', 'Timothy', 'Barbara')
            graph.addNodes('Amphitryon', 'Alcmene', 'Iphicles', 'Heracles');

            graph.addEdges(
                ['Dennis', 'Michael', { color: '#00A0B0', label: 'Foo bar' }],
                ['Michael', 'Dennis', { color: '#6A4A3C' }],
                ['Michael', 'Jessica', { color: '#CC333F' }],
                ['Jessica', 'Barbara', { color: '#EB6841' }],
                ['Michael', 'Timothy', { color: '#EDC951' }],
                ['Amphitryon', 'Alcmene', { color: '#7DBE3C' }],
                ['Alcmene', 'Amphitryon', { color: '#BE7D3C' }],
                ['Amphitryon', 'Iphicles'],
                ['Amphitryon', 'Heracles'],
                ['Barbara', 'Timothy', { color: '#6A4A3C' }]
            );

            var springy = container.springy({
                graph: graph
            });


        }
    }
}

EditorEvents.viewpointsChanged = ViewpontViewer.viewpointsChanged;