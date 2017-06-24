var FactionBox = React.createClass({
    render: function() {
        return (
            <div className="active">
                <ul>
                    <li>Alternative History</li>
                    <li>Mainstream History</li>
                </ul>
            </div>
        );
    }
});
ReactDOM.render(
    <FactionBox />,
    document.getElementById('factionContent')
);