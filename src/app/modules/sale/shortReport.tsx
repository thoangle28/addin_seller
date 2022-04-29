
import {WeeklySales, NewUsers, ItemOrders, BugReports} from './saleReport';

export const weeklySales : any = (user_id: number) => {
 /*
  WeeklySales(params).then((result) => {
    return Math.round(Math.random()*100)
  }) */
  
  return Math.round(Math.random()*100)
}

export const newUsers : any = (user_id: any) => {  
  NewUsers({user_id: user_id}).then((result) => {
    return Math.round(Math.random()*100)
  }) 
}


export const itemOrders : any = (user_id: any) => {
  ItemOrders({user_id: user_id}).then((result) => {
    return Math.round(Math.random()*100)
  }) 
}

export const bugReports : any = (user_id: any) => {
  return 1
 /*  BugReports(user_id).then((result) => {
    return Math.round(Math.random()*100)
  })  */
}

export const loadAllReports = (user_id: any) => {
  Promise.all([
    weeklySales(user_id),
    newUsers(user_id),
    itemOrders(user_id),
    bugReports(user_id)
  ]).then((result) => {
    return result
  })
}