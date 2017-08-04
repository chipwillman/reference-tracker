/// <reference path="../ReactReference/Scripts/react/react.js"/>
/// <reference path="../ReactReference/Scripts/react/react-dom.js"/>
/// <reference path="../ReactReference/Scripts/react/react-with-addons.js"/>
/// <reference path="../ReactReference/Scripts/EditorEvents.js"/>
/// <reference path="./bin/generated/ReferenceFilter.generated.js"/>
/// <reference path="./referenceFilter.test.generated.js"/>

QUnit.test("ReferenceFilter does not poll at an undefined interval",
    function (assert) {
        let testUtils = React.addons.TestUtils;
        let shallowRenderer = testUtils.createRenderer();

        shallowRenderer.render(
            <ReferenceBox />
        );

        var component = shallowRenderer.getRenderOutput();
        assert.equal(component.type, "div");
    });

QUnit.test("ReferenceFilter initial form state defaulted",
    function (assert) {
        let shallowRenderer = React.addons.TestUtils.createRenderer();
        shallowRenderer.render(
            <ReferenceBox />
        );

        var component = shallowRenderer.getRenderOutput();
        var filterInput = component.props.children[0];

        assert.equal(filterInput.type, "input");
        assert.equal(filterInput.props.placeholder, "Filter References");
    });

