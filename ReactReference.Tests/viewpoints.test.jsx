/// <reference path="../ReactReference/Scripts/react/react.js"/>
/// <reference path="../ReactReference/Scripts/react/react-dom.js"/>
/// <reference path="../ReactReference/Scripts/react/react-with-addons.js"/>
/// <reference path="../ReactReference/Scripts/EditorEvents.js"/>
/// <reference path="./bin/generated/Viewpoints.generated.js"/>
/// <reference path="./viewpoints.test.generated.js"/>

QUnit.test("ViewpointBox does not poll at an undefined interval",
    function(assert) {
        let testUtils = React.addons.TestUtils;
        let shallowRenderer = testUtils.createRenderer();

        shallowRenderer.render(
            <ViewpointBox/>
        );

        var component = shallowRenderer.getRenderOutput();
        assert.equal(component.type, "div");
    });

QUnit.test("ViewpointListItem displays the name as the title",
    function(assert) {
        let testUtils = React.addons.TestUtils;
        let shallowRenderer = testUtils.createRenderer();

        var name = "Life and times of Somebody";
        var description = "A detailed description of the Line and the time of sombody in history";
        shallowRenderer.render(
            <ViewpointListItem name={name} children={description}/>
        );

        var component = shallowRenderer.getRenderOutput();
        assert.equal(3, component.props.children.length);
        var headerElement = component.props.children[0];
        assert.equal(headerElement.type, "h3");
        assert.equal(headerElement.props.children, name);

        assert.equal(component.type, "div");
    });

QUnit.test("ViewpoitnListItem highlights its colour when the mouse hovers over it", function(assert) {
    let shallowRenderer = React.addons.TestUtils.createRenderer();

    shallowRenderer.render(<ViewpointListItem />);
    var component = shallowRenderer.getRenderOutput();

    component.props.onMouseEnter({});
    var color = component.props.style['background'];
    component = shallowRenderer.getRenderOutput();
    var newcolor = component.props.style['background'];

    assert.notEqual(color, newcolor);
    component.props.onMouseEnter({});
    component = shallowRenderer.getRenderOutput();
    var backToOriginalColor = component.props.style['background'];
    assert.equal(backToOriginalColor, color);
})