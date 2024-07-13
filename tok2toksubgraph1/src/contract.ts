import {
  BillUser as BillUserEvent,
  UserDepositUSDC as UserDepositUSDCEvent,
  UserLock as UserLockEvent,
  UserLockCancel as UserLockCancelEvent,
  UserWithdrawUSDC as UserWithdrawUSDCEvent
} from "../generated/Contract/Contract"
import {
  BillUser,
  UserDepositUSDC,
  UserLock,
  UserLockCancel,
  UserWithdrawUSDC
} from "../generated/schema"

export function handleBillUser(event: BillUserEvent): void {
  let entity = new BillUser(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserDepositUSDC(event: UserDepositUSDCEvent): void {
  let entity = new UserDepositUSDC(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserLock(event: UserLockEvent): void {
  let entity = new UserLock(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserLockCancel(event: UserLockCancelEvent): void {
  let entity = new UserLockCancel(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserWithdrawUSDC(event: UserWithdrawUSDCEvent): void {
  let entity = new UserWithdrawUSDC(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
