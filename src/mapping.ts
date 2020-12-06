import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  PerlinAss,
  ContractExpired,
  Deposit,
  DisputeSettled,
  EmergencyShutdown,
  EndedSponsorPosition,
  FinalFeesPaid,
  LiquidationCreated,
  LiquidationDisputed,
  LiquidationWithdrawn,
  NewSponsor,
  PositionCreated,
  Redeem,
  RegularFeesPaid,
  RequestTransferPosition,
  RequestTransferPositionCanceled,
  RequestTransferPositionExecuted,
  RequestWithdrawal,
  RequestWithdrawalCanceled,
  RequestWithdrawalExecuted,
  SettleExpiredPosition,
  Withdrawal
} from "../generated/PerlinAss/PerlinAss"
import { liquidation,redeem, sponsor, deposit, withdrawal,  platformStatus  } from "../generated/schema"

export function handleContractExpired(event: ContractExpired): void {
}

export function loadStatus(): platformStatus {
  let st = platformStatus.load('1');

  if (st == null) {
    st = new platformStatus('1');
    st.sponsorsQuantity=BigInt.fromI32(0)
    st.depositsQuantity=BigInt.fromI32(0)
    st.withdrawlsQuantity=BigInt.fromI32(0)
    st.liquidationsQuantity=BigInt.fromI32(0)
    st.positionsQuantity=BigInt.fromI32(0)
    st.feesPaid=BigInt.fromI32(0)
    st.collateralInPositionsAmount=BigInt.fromI32(0)
    st.tokensInPositionsAmount=BigInt.fromI32(0)
    st.redeemsQuantity=BigInt.fromI32(0)
    st.liquidationsQuantity=BigInt.fromI32(0)
    st.save();
  }
  return st as platformStatus;
}

export function createSponsor(address: Address): sponsor {
  let sp = sponsor.load(address.toHexString());

  if (sp == null) {
    sp = new sponsor(address.toHexString());
    sp.hasPosition=false
    sp.collateralInPositionAmount=BigInt.fromI32(0)
    sp.tokenInPositionAmount=BigInt.fromI32(0)
    sp.save();
    let stat=loadStatus()
    stat.sponsorsQuantity=stat.sponsorsQuantity+BigInt.fromI32(1)
    stat.save()
  }
  return sp as sponsor;
}


export function handleDeposit(event: Deposit): void {
  let entity = deposit.load(event.transaction.hash.toHex())
  if (entity == null) {
    entity = new deposit(event.transaction.hash.toHex())
    let stat=loadStatus()
    stat.depositsQuantity=stat.depositsQuantity+BigInt.fromI32(1)
    stat.save()
  }
  entity.collateralAmount=event.params.collateralAmount
  entity.sponsor=createSponsor(event.params.sponsor).id
  entity.depositTimestanp=event.block.timestamp
  entity.save()
}

export function handleDisputeSettled(event: DisputeSettled): void {
}

export function handleEmergencyShutdown(event: EmergencyShutdown): void {
}

export function handleEndedSponsorPosition(event: EndedSponsorPosition): void {
  let sp=createSponsor(event.params.sponsor)
  sp.hasPosition=false
  sp.collateralInPositionAmount=BigInt.fromI32(0)
  sp.tokenInPositionAmount=BigInt.fromI32(0)
  sp.save()
  let st=loadStatus()
  st.positionsQuantity=st.positionsQuantity-BigInt.fromI32(1)
  st.save()
}

export function handleFinalFeesPaid(event: FinalFeesPaid): void {
  let st=loadStatus()
  st.feesPaid=st.feesPaid+event.params.amount
  st.save()
}

export function handleLiquidationCreated(event: LiquidationCreated): void {
  let entity = liquidation.load(event.transaction.hash.toHex())
  if (entity == null) {
    entity = new liquidation(event.transaction.hash.toHex())
    let stat=loadStatus()
    stat.liquidationsQuantity=stat.liquidationsQuantity+BigInt.fromI32(1)
    stat.collateralInPositionsAmount=stat.collateralInPositionsAmount-event.params.liquidatedCollateral
    stat.save()
  }
  entity.liquidatedCollateral=event.params.liquidatedCollateral
  entity.liquidationId=event.params.liquidationId
  entity.liquidationTime=event.params.liquidationTime
  entity.liquidator=createSponsor(event.params.liquidator).id
  entity.sponsor=createSponsor(event.params.sponsor).id
  entity.lockedCollateral=event.params.lockedCollateral
  entity.tokensOutstanding=event.params.tokensOutstanding
  entity.save()
}

export function handleLiquidationDisputed(event: LiquidationDisputed): void {
}

export function handleLiquidationWithdrawn(event: LiquidationWithdrawn): void {
}

export function handleNewSponsor(event: NewSponsor): void {
  createSponsor(event.params.sponsor)
}

export function handlePositionCreated(event: PositionCreated): void {
  let sp=createSponsor(event.params.sponsor)
  sp.hasPosition=true
  sp.collateralInPositionAmount=sp.collateralInPositionAmount+event.params.collateralAmount
  sp.tokenInPositionAmount=sp.tokenInPositionAmount+event.params.tokenAmount
  sp.save()
}

export function handleRedeem(event: Redeem): void {
  let sp= createSponsor(event.params.sponsor)
  sp.collateralInPositionAmount=sp.collateralInPositionAmount-event.params.collateralAmount
  sp.tokenInPositionAmount=sp.tokenInPositionAmount-event.params.tokenAmount
  sp.save()
  let entity = redeem.load(event.transaction.hash.toHex())
  if (entity == null) {
    entity = new redeem(event.transaction.hash.toHex())
    let stat=loadStatus()
    stat.redeemsQuantity=stat.redeemsQuantity+BigInt.fromI32(1)
    stat.save()
  }
  entity.collateralAmount=event.params.collateralAmount
  entity.tokenAmount=event.params.tokenAmount
  entity.sponsor=createSponsor(event.params.sponsor).id
  entity.redeemTimestamp=event.block.timestamp
  entity.save()
}

export function handleRegularFeesPaid(event: RegularFeesPaid): void {
}

export function handleRequestTransferPosition(event: RequestTransferPosition): void {
}

export function handleRequestTransferPositionCanceled(event: RequestTransferPositionCanceled): void {
}

export function handleRequestTransferPositionExecuted(event: RequestTransferPositionExecuted): void {
}

export function handleRequestWithdrawal(event: RequestWithdrawal): void {
}

export function handleRequestWithdrawalCanceled(event: RequestWithdrawalCanceled): void {
}

export function handleRequestWithdrawalExecuted(event: RequestWithdrawalExecuted): void {
  let entity = withdrawal.load(event.transaction.hash.toHex())
  if (entity == null) {
    entity = new withdrawal(event.transaction.hash.toHex())
    let stat=loadStatus()
    stat.withdrawlsQuantity=stat.withdrawlsQuantity+BigInt.fromI32(1)
    stat.save()
  }
  entity.collateralAmount=event.params.collateralAmount
  entity.sponsor=createSponsor(event.params.sponsor).id
  entity.withdrawlTimestamp=event.block.timestamp
  entity.save()

}

export function handleSettleExpiredPosition(event: SettleExpiredPosition): void {
}

export function handleWithdrawal(event: Withdrawal): void {
  let entity = withdrawal.load(event.transaction.hash.toHex())
  if (entity == null) {
    entity = new withdrawal(event.transaction.hash.toHex())
    let stat=loadStatus()
    stat.withdrawlsQuantity=stat.withdrawlsQuantity+BigInt.fromI32(1)
    stat.save()
  }
  entity.collateralAmount=event.params.collateralAmount
  entity.sponsor=createSponsor(event.params.sponsor).id
  entity.withdrawlTimestamp=event.block.timestamp
  entity.save()
}



// Note: If a handler doesn't require existing field values, it is faster
// _not_ to load the entity from the store. Instead, create it fresh with
// `new Entity(...)`, set the fields that should be updated and save the
// entity back to the store. Fields that were not set or unset remain
// unchanged, allowing for partial updates to be applied.

// It is also possible to access smart contracts from mappings. For
// example, the contract that has emitted the event can be connected to
// with:
//
// let contract = Contract.bind(event.address)
//
// The following functions can then be called on this contract to access
// state variables and other data:
//
// - contract.collateralCurrency(...)
// - contract.collateralRequirement(...)
// - contract.contractState(...)
// - contract.createLiquidation(...)
// - contract.cumulativeFeeMultiplier(...)
// - contract.dispute(...)
// - contract.disputeBondPct(...)
// - contract.disputerDisputeRewardPct(...)
// - contract.excessTokenBeneficiary(...)
// - contract.expirationTimestamp(...)
// - contract.expiryPrice(...)
// - contract.finder(...)
// - contract.getCollateral(...)
// - contract.getCurrentTime(...)
// - contract.getLiquidations(...)
// - contract.liquidationLiveness(...)
// - contract.liquidations(...)
// - contract.minSponsorTokens(...)
// - contract.payRegularFees(...)
// - contract.pfc(...)
// - contract.positions(...)
// - contract.priceIdentifier(...)
// - contract.rawLiquidationCollateral(...)
// - contract.rawTotalPositionCollateral(...)
// - contract.redeem(...)
// - contract.settleExpired(...)
// - contract.sponsorDisputeRewardPct(...)
// - contract.timerAddress(...)
// - contract.tokenCurrency(...)
// - contract.totalPositionCollateral(...)
// - contract.totalTokensOutstanding(...)
// - contract.trimExcess(...)
// - contract.withdraw(...)
// - contract.withdrawLiquidation(...)
// - contract.withdrawPassedRequest(...)
// - contract.withdrawalLiveness(...)