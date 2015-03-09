"use strict";

var React = require("react");
var CryptoJs = require("crypto-js");

var Hasher = require("./utilities/hasher.jsx");
var Encoder = require("./utilities/encoder.jsx");
var Decoder = require("./utilities/decoder.jsx");

var MIN_TAB = 0;
var MAX_TAB = 2;

var Stringistics = React.createClass({
    getInitialState: function () {
        var text = localStorage.getItem("text") || "";
        var active_tab = parseInt(localStorage.getItem("active_tab") || "0");
        return {
            text: text,
            is_loaded: false,
            active_tab: active_tab
        };
    },
    componentWillMount: function () {
        chrome.commands.onCommand.addListener(this._onCommand);
    },
    componentDidMount: function () {
        var textarea = this.refs.textarea.getDOMNode();
        var text = this.state.text;
        textarea.value = text;
    },
    componentWillUnmount: function () {
        chrome.commands.onCommand.removeListener(this._onCommand);
    },
    _onCommand: function (command) {
        if (command === "decrement_tab") {
            this._switchTabLR(-1);
        } else if (command === "increment_tab") {
            this._switchTabLR(1);
        }
        return true;
    },
    _switchTab: function (active_tab) {
        this.setState({
            active_tab: active_tab
        });
        localStorage.setItem("active_tab", active_tab);
    },
    _switchTabLR: function (direction) {
        var active_tab = this.state.active_tab;
        active_tab = Math.min(Math.max(MIN_TAB, active_tab + direction), MAX_TAB);
        this._switchTab(active_tab);
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
        var self = this;

        if (!this.state.is_loaded) {
            setTimeout(this._selectText, 128);
        }

        var text = this.state.text;
        var active_tab = this.state.active_tab;

        var Menu = [ "Hasher", "Encoder", "Decoder" ].map(function (tab, index) {
            return <a key={ index } onClick={ self._switchTab.bind(self, index) } className={ (index === active_tab ? "active " : "") + "item" }>{ tab }</a>;
        });

        var utils = [ Hasher, Encoder, Decoder ];
        var Utility = React.createElement(utils[active_tab], { text: text });

        return (
            <div className="ui basic small form segment" style={{ paddingTop: "52px" }}>
                <div className="ui pointing teal fixed top secondary menu" style={{ marginTop: "4px" }}>
                    { Menu }
                </div>
                <div className="field">
                    <textarea ref="textarea" onChange={ this._updateText } style={{ resize: "none" }}></textarea>
                </div>
                { Utility }
            </div>
        );
    }
});

var EntryPoint = document.getElementById('react-entry');
React.render(<Stringistics />, EntryPoint);
