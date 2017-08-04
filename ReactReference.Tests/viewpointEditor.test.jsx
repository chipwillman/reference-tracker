/// <reference path="../ReactReference/Scripts/react/react.js"/>
/// <reference path="../ReactReference/Scripts/react/react-dom.js"/>
/// <reference path="../ReactReference/Scripts/react/react-with-addons.js"/>
/// <reference path="../ReactReference/Scripts/EditorEvents.js"/>
/// <reference path="./bin/generated/ViewpointEditor.generated.js"/>
/// <reference path="./viewpointEditor.test.generated.js"/>

QUnit.test("ViewpointEditor does not poll at an undefined interval",
    function (assert) {

        var editorViewpoint = {
            ViewPointId: 'uniqueViewPointId',
            Name: 'Test Viewpoint For Editor Test',
            BeginDate: 'c 2017',
            EndDate: null,
            Description: 'much longer text that servers as a description for the test viewpoint for editor test',
            Evidence: [],
            References: []
        };

        let testUtils = React.addons.TestUtils;
        let shallowRenderer = testUtils.createRenderer();

        EditorEvents.isLoggedIn = true;
        shallowRenderer.render(
            <ViewpointEvidenceEditor viewpointId={editorViewpoint.ViewPointId} editorViewpoint={editorViewpoint}/>
        );

        var component = shallowRenderer.getRenderOutput();
        assert.notEqual(component, null);

        component = shallowRenderer.getRenderOutput();
        assert.equal(component.type, "div");
    });
