import { WorkFlows } from "../enums"

export const RefundFlow = {
    newIssues: WorkFlows.NEW_ISSUE,
    manualRefunds: WorkFlows.MANUAL_REFUNDS,
    autoRefunds: WorkFlows.AUTO_REFUNDS,
    reviewVerify: WorkFlows.REVIEW_VERIFY,
    done: WorkFlows.DONE
}
