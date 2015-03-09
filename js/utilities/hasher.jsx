"use strict";

var React = require("react");
var CryptoJs = require("crypto-js");

var Hasher = React.createClass({
    render: function () {
        var text = this.props.text;
        return (
            <div>
                <div className="field">
                    <label>MD5</label>
                    <input type="text" value={ CryptoJs.MD5(text) } readOnly />
                </div>
                <div className="field">
                    <label>SHA1</label>
                    <input type="text" value={ CryptoJs.SHA1(text) } readOnly />
                </div>
            </div>
        );
    }
});

module.exports = Hasher;
