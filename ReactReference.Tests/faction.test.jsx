/// <reference path="../ReactReference/Scripts/react/react.js"/>
/// <reference path="../ReactReference/Scripts/react/react-dom.js"/>
/// <reference path="../ReactReference/Scripts/react/react-with-addons.js"/>
/// <reference path="../ReactReference/Scripts/EditorEvents.js"/>
/// <reference path="./bin/generated/Faction.generated.js"/>
/// <reference path="./faction.test.generated.js"/>

QUnit.test("FactionBox does not poll at an undefined interval", function (assert) {
    let testUtils = React.addons.TestUtils;
    let shallowRenderer = testUtils.createRenderer();

    shallowRenderer.render(
        <FactionBox />
    );

    var component = shallowRenderer.getRenderOutput();
    assert.equal(component.type, "div");
});