"use strict";

var React = require("react");
var CryptoJs = require("crypto-js");

var Decoder = React.createClass({
    render: function () {
        var text = this.props.text;
        return (
            <div>
                <div className="field">
                    <label>URL Decode</label>
                    <textarea style={{ resize: "none" }} value={ text } readOnly></textarea>
                </div>
            </div>
        );
    }
});

module.exports = Decoder;
