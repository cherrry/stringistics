"use strict";

var React = require("react");
var CryptoJs = require("crypto-js");

var Stringistics = React.createClass({
    getInitialState: function () {
        var text = localStorage.getItem("text") || "";
        return {
            text: text,
            is_loaded: false
        };
    },
    componentDidMount: function () {
        var textarea = this.refs.textarea.getDOMNode();
        var text = this.state.text;
        textarea.value = text;
    },
    _updateText: function (event) {
        var text = event.target.value;
        localStorage.setItem("text", text);
        this.setState({
            text: text
        });
    },
    _selectText: function (event) {
        var textarea = this.refs.textarea.getDOMNode();
        var text = this.state.text;
        textarea.selectionStart = 0;
        textarea.selectionEnd = text.length;
        this.setState({
            is_loaded: true
        });
    },
    render: function () {

        if (!this.state.is_loaded) {
            setTimeout(this._selectText, 100);
        }

        var text = this.state.text;

        return (
            <div className="ui fluid one wide grid">
                <div className="column">
                    <div className="ui basic small form segment">
                        <h4 className="ui header">Hashing</h4>
                        <div className="field">
                            <textarea ref="textarea" onChange={ this._updateText } style={{ resize: "none" }}></textarea>
                        </div>
                        <div className="field">
                            <label>MD5</label>
                            <input type="text" value={ CryptoJs.MD5(text) } readOnly />
                        </div>
                        <div className="field">
                            <label>SHA1</label>
                            <input type="text" value={ CryptoJs.SHA1(text) } readOnly />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var EntryPoint = document.getElementById('react-entry');
React.render(<Stringistics />, EntryPoint);
