import { all, fork } from 'redux-saga/effects';
import axios from 'axios';
import postSaga from './post';
import userSaga from './user';
import { backURL } from '../config/config';

axios.defaults.baseURL = backURL;
axios.defaults.withCredentials = true; // cookie를 백엔드로 전달하기 위해서

export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
