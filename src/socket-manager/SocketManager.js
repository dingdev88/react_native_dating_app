import SocketIOClient from 'socket.io-client';
import * as SocketActions from './SocketActions';
import { api } from '../config'; 

export default class SocketManager {
	static instance = null;


	constructor() {
		this.socket = null;
		this.listeners = [];
	}

	static initialized() {
		return this.instance !== null;
	}

	static getInstance() {
		if (SocketManager.instance == null) {
			SocketManager.instance = new SocketManager();
		}
		return this.instance;
	}

	addListener = (listener) => {
		this.listeners.push(listener);
	}

	callListeners = (event, payload) => {
		console.log("SOCKET_EVENT: ", event);
		console.log("Payload", payload);
		this.listeners.map(listener => {
			listener(event, payload)
		})
	}

	connect = () => {
		console.log("connect", api.socketURL);
		this.socket = SocketIOClient(api.socketURL, {transports: ['websocket']});

		this.socket.on(SocketActions.CONNECT, () => {
			console.log("socket connected!");
			this.callListeners(SocketActions.CONNECT);

		});

		this.socket.on(SocketActions.DISCONNECT, () => {
			this.callListeners(SocketActions.DISCONNECT);
		});

		this.socket.on(SocketActions.GET_STATUS, (payload)=> {
			this.callListeners(SocketActions.GET_STATUS, payload);
		})

		this.socket.on(SocketActions.MULTIPLE_MESSAGES, (payload)=> {
			this.callListeners(SocketActions.MULTIPLE_MESSAGES, payload)
		})

		this.socket.on(SocketActions.INITIALIZE_UNAVAILABLE_IDS_LIST, (payload)=> {
			this.callListeners(SocketActions.INITIALIZE_UNAVAILABLE_IDS_LIST, payload)
		})

		this.socket.on(SocketActions.UPDATE_UNAVAILABLE_IDS_LIST, (payload)=> {
			this.callListeners(SocketActions.UPDATE_UNAVAILABLE_IDS_LIST, payload)
		})

		this.socket.on(SocketActions.PRIVATE_MESSAGE, (payload)=> {
			this.callListeners(SocketActions.PRIVATE_MESSAGE, payload)
		})
		
		this.socket.on(SocketActions.PRIVATE_MESSAGE_SENT, (payload) => {
			this.callListeners(SocketActions.PRIVATE_MESSAGE_SENT, payload)
		})

		this.socket.on(SocketActions.TYPING, (payload) => {
			this.callListeners(SocketActions.TYPING, payload)
		})
		this.socket.on(SocketActions.TYPING_STOPPED, (payload) => {
			this.callListeners(SocketActions.TYPING_STOPPED, payload)
		})

		this.socket.on(SocketActions.TYPING_STOPPED, (payload) => {
			this.callListeners(SocketActions.TYPING_STOPPED, payload)
		})
		this.socket.on(SocketActions.MESSAGE_STATUS_UPDATE, (payload) => {
			this.callListeners(SocketActions.MESSAGE_STATUS_UPDATE, payload)
		})

		this.socket.on(SocketActions.MESSAGE_DELETE, (payload) => {
			this.callListeners(SocketActions.MESSAGE_DELETE, payload)
		})

		this.socket.on(SocketActions.GROUP_CHAT_MESSAGE, (payload) => {
			this.callListeners(SocketActions.GROUP_CHAT_MESSAGE, payload)
		})
		
		this.socket.on(SocketActions.GROUP_CHAT_MESSAGE_SENT, (payload)=> {
			this.callListeners(SocketActions.GROUP_CHAT_MESSAGE_SENT, payload)
		})

		this.socket.on(SocketActions.VOICE_CALL, (payload)=> {
			this.callListeners(SocketActions.VOICE_CALL, payload)
		})
		this.socket.on(SocketActions.VOICE_CALL_OFF, (payload)=> {
			this.callListeners(SocketActions.VOICE_CALL_OFF, payload)
		})
		this.socket.on(SocketActions.REJECT_CALL, (payload)=> {
			this.callListeners(SocketActions.REJECT_CALL, payload)
		})

	}

	loginSignup = (userId, password) => {
		let data = {
			userId,
			password
		}
		console.log("loginSignup", data);
		this.socket.emit(SocketActions.LOGIN_SIGNUP, data);
	}

	getChatsOnlineStatus = (userIds, fromId) => {
		let data = {
			userIds,
			fromId
		}
		this.socket.emit(SocketActions.GET_CHATS_ONLINE_STATUS, data);
	}

	privateMessage = (message) => {
		console.log("privateMessage", message );
		this.socket.emit(SocketActions.PRIVATE_MESSAGE, message);
	}

	typing = (roomId, toUserId, fromUserId) => {
		data = {
			roomId,
			toUserId,
			fromUserId
		}
		this.socket.emit(SocketActions.TYPING, data);
	}

	typingStoped = (roomId, toUserId, fromUserId) => {
		data = {
			roomId,
			toUserId,
			fromUserId
		}
		this.socket.emit(SocketActions.TYPING_STOPPED, data);
	}

	messageStatusUpdate = (roomId, messageId, deliveryStatus) => {
		data = {
			roomId,
			messageId,
			deliveryStatus
		}
		this.socket.emit(SocketActions.MESSAGE_STATUS_UPDATE, data);
	}

	messageDelete = (messageId) => {
		data = {
			messageId
		}
		this.socket.emit(SocketActions.MESSAGE_DELETE, data);
	}

	groupChatMessage = (message) => {
		this.socket.emit(SocketActions.GROUP_CHAT_MESSAGE, message);
	}

	getStatus = (userId, onlineStatus) => {
		data = {
			userId,
			onlineStatus
		}
		this.socket.emit(SocketActions.GET_STATUS, data);
	}

	setUserAway = (userId) => {
		this.socket.emit(SocketActions.SET_USER_WAY, userId);
	}

	setUserOffline = (userId) => {
		this.socket.emit(SocketActions.SET_USER_OFFLINE, userId);
	}

	voiceCall = (data) => {
		this.socket.emit(SocketActions.VOICE_CALL, data);
	}
	voiceCallOff = (data) => {
		this.socket.emit(SocketActions.VOICE_CALL_OFF, data);
	}
	rejectCall = (data) => {
		this.socket.emit(SocketActions.REJECT_CALL, data);
	}
	disconnect = () => {
		if (this.socket && this.socket.connected) {
			//this.socket.emit(SocketActions.STOP_LIGHT_SHOW, app.id);
			this.socket.disconnect();
		}
	}

}
