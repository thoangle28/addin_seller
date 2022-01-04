import {FC, useEffect, useState} from 'react'
import { shallowEqual, useSelector, useDispatch, connect, ConnectedProps } from 'react-redux'
import * as product from './ProductRedux'
import {RootState} from '../../../../setup'
