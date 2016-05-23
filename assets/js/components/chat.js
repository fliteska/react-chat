var ChatBox = React.createClass({
    sendMessage: function(txt) {
        var data = {
            type: 'msg',
            name: this.state.name,
            text: txt,
            color: this.state.color
        };
        this.socket.send(JSON.stringify(data));
    },
    chooseColor: function(v) {
        this.setState({color: v});
    },
    getInitialState: function() {
        return {
            name: this.props.name,
            color: this.props.color,
            status: 'inactive',
            messages: [],
            counter: 0
        };
    },
    componentDidMount: function() {

        this.socket = new WebSocket("ws://localhost:30000");
        this.socket.onopen = function() {
            this.setState({status: 'active'});
            var data = {
                type: 'msg',
                name: 'Chat Bot',
                color: '#F90',
                text: this.state.name + ' has entered chat!'
            };
            this.socket.send(JSON.stringify(data));
        }.bind(this);
        this.socket.onmessage = function(event) {
            this.addMessage(event.data, false);
        }.bind(this);

    },
    componentWillUnmount: function() {
        this.socket.close();
    },
    addMessage: function(data, parsed) {
        if (!parsed) {
            data = JSON.parse(data);
        }
        switch (data.type) {
            case 'msg':
                var msgs = this.state.messages;
                var c = this.state.counter + 1;
                var msg = {
                    name: data.name,
                    text: data.text,
                    color: data.color,
                    id: c
                };

                msgs.unshift(msg);
                this.setState({messages: msgs, counter: c});
            break;
        }
    },
    render: function() {
        return <div className="id-chat container">
            <ColorSelect colors={this.props.colors} color={this.state.color} choose={this.chooseColor} />
            <StatusBar name={this.state.name} color={this.state.color} status={this.state.status} />
            <SpeakBar onPostMessage={this.sendMessage} />
            <ChatMessages data={this.state.messages} />
        </div>
    }
});

var StatusBar = React.createClass({
    render: function() {
        return <div className="row">
            <div className="col xs6">
                Logged in as: <strong style={{color: this.props.color}}>{this.props.name}</strong>
            </div>
            <div className="col xs6 text-right">
                Connection: <strong>{this.props.status}</strong>
            </div>
        </div>
    }
});

var SpeakBar = React.createClass({
    getInitialState: function() {
        return {
            text: ''
        };
    },
    textChange: function(event) {
        this.setState({text: event.target.value});
    },
    keyPress: function(event) {
        if (event.which == 13) {
            this.send();
        }
    },
    send: function() {
        this.props.onPostMessage(this.state.text);
        this.setState({text: ''});
    },
    render: function() {
        return <div className="speak-bar row">
            <div className="col xs8 s10">
                <input type="text" className="block" value={this.state.text} onKeyPress={this.keyPress} onChange={this.textChange} />
            </div>
            <div className="col xs4 s2">
                <button className="button block" onClick={this.send}>Say</button>
            </div>
        </div>
    }
});

var ChatMessages = React.createClass({
    render: function() {
        return <div className="row">
            <div className="col xs12">
                <ul className="list-group">
                    {
                        this.props.data.map(function(msg) {
                            return <li key={msg.id}>
                                <strong style={{color: msg.color}}>{msg.name}</strong> says: {msg.text}
                            </li>
                        })
                    }
                </ul>
            </div>
        </div>
    }
});

var Welcome = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            color: this.props.color
        };
    },
    nameChange: function(v) {
        this.setState({name: v});
    },
    chooseColor: function(v) {
        this.setState({color: v});
    },
    enterChat: function() {
        ReactDOM.render(
            <ChatBox name={this.state.name} colors={colors} color={this.state.color} />,
            document.getElementById('root')
        );
    },
    render: function() {
        return <div className="id-chat container">
            <div className="row">
                <div className="col o-m4 m4 o-s2 s8 o-xs1 xs10">
                    <NicknameGenerator onNameChange={this.nameChange} />
                    <ColorSelect colors={this.props.colors} color={this.state.color} choose={this.chooseColor} />
                    <NicknameDisplay name={this.state.name} color={this.state.color} />
                    <button className="button block" onClick={this.enterChat}>Enter Chat</button>
                </div>
            </div>
        </div>
    }
});

var NicknameDisplay = React.createClass({
    render: function() {
        return <div className="row">
            <div className="col xs12">
                <strong style={{color: this.props.color}}>
                    {this.props.name}
                </strong>
            </div>
        </div>
    }
});

var NicknameGenerator = React.createClass({
    componentDidMount: function() {
        this.randomiseName();
    },
    randomiseName: function() {
        $.get('/randomise.php').success(function(data) {
            this.setState({name: data});
            this.props.onNameChange(data);
        }.bind(this));
    },
    render: function() {
        return <div className="row">
            <div className="col xs12">
                <input type="button" className="button block" onClick={this.randomiseName} value="Generate Nickname" />
            </div>
        </div>
    }
});

var ColorSelect = React.createClass({
    getInitialState: function() {
        return {
            color: this.props.color
        };
    },
    selectChange: function(e) {
        var value = e.target.value;
        this.setState({color: value});
        this.props.choose(value);
    },
    render: function() {
        var colors = this.props.colors.map(function(c, i) {
            return <Color value={c} key={i} />
        }.bind(this));
        return <div className="row">
            <div className="col xs12">
                <select className="block" onChange={this.selectChange}>
                    <option>Select Color (current: {this.state.color})</option>
                    {colors}
                </select>
            </div>
        </div>
    }
});

var Color = React.createClass({
    render: function() {
        return <option
            style={{background: this.props.value, color: this.props.value}}
            value={this.props.value}>
            {this.props.value}
        </option>
    }
});

var colors = ['black', 'red', 'blue', 'yellow', 'green'];

ReactDOM.render(
    <Welcome colors={colors} color="black" />,
    document.getElementById('root')
);