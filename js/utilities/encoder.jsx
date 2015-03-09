"use strict";

var React = require("react");
var CryptoJs = require("crypto-js");

var Encoder = React.createClass({
    render: function () {
        var text = this.props.text;
        return (
            <div>
                <div className="field">
                    <label>URL Encode</label>
                    <textarea style={{ resize: "none" }} value={ encodeURIComponent(text) } readOnly></textarea>
                </div>
            </div>
        );
    }
});

module.exports = Encoder;
