import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BillUser,
  UserDepositUSDC,
  UserLock,
  UserLockCancel,
  UserWithdrawUSDC
} from "../generated/Contract/Contract"

export function createBillUserEvent(user: Address, amount: BigInt): BillUser {
  let billUserEvent = changetype<BillUser>(newMockEvent())

  billUserEvent.parameters = new Array()

  billUserEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  billUserEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return billUserEvent
}

export function createUserDepositUSDCEvent(
  user: Address,
  amount: BigInt
): UserDepositUSDC {
  let userDepositUsdcEvent = changetype<UserDepositUSDC>(newMockEvent())

  userDepositUsdcEvent.parameters = new Array()

  userDepositUsdcEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  userDepositUsdcEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return userDepositUsdcEvent
}

export function createUserLockEvent(user: Address): UserLock {
  let userLockEvent = changetype<UserLock>(newMockEvent())

  userLockEvent.parameters = new Array()

  userLockEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )

  return userLockEvent
}

export function createUserLockCancelEvent(user: Address): UserLockCancel {
  let userLockCancelEvent = changetype<UserLockCancel>(newMockEvent())

  userLockCancelEvent.parameters = new Array()

  userLockCancelEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )

  return userLockCancelEvent
}

export function createUserWithdrawUSDCEvent(
  user: Address,
  amount: BigInt
): UserWithdrawUSDC {
  let userWithdrawUsdcEvent = changetype<UserWithdrawUSDC>(newMockEvent())

  userWithdrawUsdcEvent.parameters = new Array()

  userWithdrawUsdcEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  userWithdrawUsdcEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return userWithdrawUsdcEvent
}
