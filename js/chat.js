Vue.prototype.moment = moment;

var index_page = {
	template: document.getElementById('index-page'),
	data: function() {
		return {
			
		}
	},
	methods: {
		getUserinfo: function (uid) {
			var self = this;
			var user;
			user = this.$store.state.users[uid];
			if (user) {
				return user;
			}
			getJsonSync(
				'api/getUserinfo', {
					id: uid
				},
				function(ret) {
					if(ret.code == 200) {
						user = {
							uid: uid,
							nickname: ret.data.nickname,
							avatar: ret.data.avatar ? config.imgBasePath + ret.data.avatar : 'img/tittle.png'
						}	
					}
				},
				null,
				true
			);

			if (user) {
				self.$store.commit('addUser', {uid: uid, userinfo: user});
				return user;
			} else {
				return false;
			}
		}
	},
	computed: {
		msgs: function() {
			var ret = [];
			var obj = this.$store.state.msgs;
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					ret.push(obj[key][obj[key].length - 1]); //取与每个人对话的最后一条
				}
			}
			return ret;
		}
	}
}

var chat_page = {
	template: document.getElementById('chat-page'),
	beforeRouteEnter: function(to, from, next) {
		if (to.params.id == store.state.uid) {
			back();
			return;
		}
		next();
	},
	data: function() {
		return {
			inputContent: '',
			oContent: {},
			oTextarea: {},
			emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '🤓', '😜', '😎', '😊', '😳', '🙄', '😱', '😒', '😔', '😷', '👿', '🤗', '😩', '😤', '😣', '😰', '😴', '😬', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '😹', '⚡️', '🔥', '🌈', '🍏', '⚽️', '❤️', '🇨🇳'],
			isShowEmoji: false,
			isRedAI: false,
			uid: this.$store.state.uid,
			nickname: this.$store.state.nickname,
			avatar: this.$store.state.avatar,
			ws: null
		}
	},
	watch: {

	},
	computed: {
		// name: function() {
		// 	return this.$store.state.name;
		// },
		// avatarUrl: function() {
		// 	return this.$store.state.avatarUrl;
		// },
		msgs: function() {
			return this.$store.state.msgs[this.to.uid]
		}
	},
	created: function() {
		var id;
		this.to = this.getUserinfo(this.$route.params.id)
		this.newLine();
	},
	mounted: function() {
		

		// this.oTextarea = document.querySelector('textarea');
		this.newLine();
	},
	methods: {
		formatTime: function(time) {
			//1分钟之内的消息不显示时间
			var is_recent = this.moment(time).isBetween(moment().startOf('minute'), moment().endOf('minute'));
			return is_recent ? '' : this.moment(time, 'YYYY-MM-DD HH:mm:ss').fromNow();
		},
		getUserinfo: function (uid) {
			var self = this;
			var user;
			user = this.$store.state.users[uid];
			if (user) {
				return user;
			}
			getJsonSync(
				'api/getUserinfo', {
					id: uid
				},
				function(ret) {
					if(ret.code == 200) {
						user = {
							uid: uid,
							nickname: ret.data.nickname,
							avatar: ret.data.avatar ? config.imgBasePath + ret.data.avatar : 'img/tittle.png'
						}	
					}
				},
				null,
				true
			);

			if (user) {
				self.$store.commit('addUser', {uid: uid, userinfo: user});
				return user;
			}
		},
		send: function() {
			this.isShowEmoji = false;
			if(this.inputContent === '') {
				return;
			} else {
				if (ws.readyState !== ws.OPEN) {
					mui.alert('连接已关闭');
					return;
				}
				this.$store.commit('addNewMsg', {
					uid: this.to.uid,
					msg: {
						uid: this.to.uid,
						type: 'text',
						toMe: false,
						time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
						message: this.inputContent
					}
				})
				ws.send(JSON.stringify({
					from: this.uid,
					to: this.to.uid,
					type: 'text',
					time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
					message: this.inputContent
				}));

				this.inputContent = '';
				this.newLine();
			};
		},
		showEmoji: function(flag) {
			this.isShowEmoji = flag;
		},

		insertText: function(str) {
			str = str + ' ';
			const oTextarea = this.$refs.textarea;

			if(document.selection) {

				let sel = document.selection.createRange();

				sel.text = str;

			} else if(typeof oTextarea.selectionStart === 'number' && typeof oTextarea.selectionEnd === 'number') {

				let startPos = oTextarea.selectionStart;
				let endPos = oTextarea.selectionEnd;
				let cursorPos = startPos;
				let tempVal = oTextarea.value;
				this.inputContent = tempVal.substring(0, startPos) + str + tempVal.substring(startPos, tempVal.length)
				cursorPos += str.length;
				oTextarea.selectionStart = oTextarea.selectionEnd = cursorPos;

			} else {
				oTextarea.value += str;
			}
		},

		newLine: function() {
			var self = this;
			Vue.nextTick(function(){
				// self.oContent.scrollTop = self.oContent.scrollHeight
				var oContent = document.querySelector('.chatting-content');
				window.scrollTo(0, oContent.scrollHeight)
			})
		}
	}
}

var router = new VueRouter({
	routes: [{
			path: '/',
			component: index_page
		},
		{
			path: '/chat/:id',
			component: chat_page
		}
	]
});

Vue.nextTick(function() {
	var textarea = document.querySelector('textarea');
	
	textarea && (textarea.scrollTop = textarea.scrollHeight);
})
var userinfo = storage.getItem('userinfo');
if (!userinfo) {
	clicked('login.html');
}
var userinfo = JSON.parse(storage.getItem('userinfo'));
const store = new Vuex.Store({
	state: {
		uid: userinfo.id,
		nickname: userinfo.nickname,
		avatar: userinfo.avatar,
		users: {},
		msgs: {}
	},
	mutations: {
		addNewMsg: function(state, payload) {
			if (!state.msgs[payload.uid]) {
				Vue.set(state.msgs, payload.uid, [])
			}
			state.msgs[payload.uid].push(payload.msg);
		},
		addUser: function(state, payload) {
			state.users[payload.uid] = payload.userinfo;
		}
	}
})
var vm = new Vue({
	router: router,
	store: store,
	created: function() {

	},
	methods: {
		getOfflineMsgs: function() {

		}
	}
}).$mount('#app');

var ws; //全局websocket对象
var connectWsServer = function() {
	ws = new WebSocket(config.ws_server + "?token=" + storage.getItem('token'))
	ws.onopen = function(e) {
		onOpen(e)
	};
	ws.onclose = function(e) {
		onClose(e)
	};
	ws.onmessage = function(e) {
		onMessage(e)
	};
	ws.onerror = function(e) {
		onError(e)
	};

	function onOpen(e) {
		console.log("Connected to WebSocket server.");
	}

	function onClose(e) {
		console.log("Disconnected");
	}

	function onMessage(e) {
		// console.log('Retrieved data from server: ' + e.data);
		var data = e.data;
		if('pong' == data) {
			return;
		}
		var data = JSON.parse(data);
		if (data.event == 'message') {
			store.commit('addNewMsg', {
				uid: data.msg.uid,
				msg: {
					message: data.msg.message,
					time: data.msg.time,
					toMe: true,
					type: 'text',
					uid: data.msg.uid
				}
			})
			Vue.nextTick(function(){
				// self.oContent.scrollTop = self.oContent.scrollHeight
				var oContent = document.querySelector('.chatting-content');
				oContent && window.scrollTo(0, oContent.scrollHeight)
			})
		}

		if (data.event == 'getOfflineMessage') {
			var messages = data.msgs;
			for (var i = 0, len = data.msgs.length; i < len; i++) {
				var obj;

				if (store.state.uid == data.msgs[i].from) {
					obj = {
						uid: data.msgs[i].to,
						msg: {
							message: data.msgs[i].message,
							time: data.msgs[i].time,
							toMe: false,
							type: data.msgs[i].type,
							uid: data.msgs[i].to
						}
					}
				} else {
					obj = {
						uid: data.msgs[i].from,
						msg: {
							message: data.msgs[i].message,
							time: data.msgs[i].time,
							toMe: true,
							type: data.msgs[i].type,
							uid: data.msgs[i].from
						}
					}
				}

				store.commit('addNewMsg', obj);
				Vue.nextTick(function(){
					// self.oContent.scrollTop = self.oContent.scrollHeight
					var oContent = document.querySelector('.chatting-content');
					oContent && window.scrollTo(0, oContent.scrollHeight)
				})
			}
		}

	}

	function onError(e) {
		console.log('Error occured: ' + e.data);
	}
}
connectWsServer(); //连接服务器
