
import { store } from "@/lib/store";
import mongoose from "mongoose";

async function main() {
    await store.connect();
    console.log("Connected to DB");

    // 1. Create a dummy project progress
    const contractId = new mongoose.Types.ObjectId().toString();
    const customerId = new mongoose.Types.ObjectId().toString();

    const created = await store.createProjectProgress({
        contractId: contractId,
        customerId: customerId,
        projectName: "Test Project",
        status: "progress",
        overallProgress: 0,
        milestones: [
            {
                id: "m1",
                phase: 1,
                description: "Test Milestone",
                progressPercentage: 100,
                checklist: [],
                images: [],
                updatedAt: new Date().toISOString(),
                paymentStatus: "paid",
                paymentAmount: 1000,
                paymentMethod: "transfer",
                paidAt: new Date().toISOString(),
                transferDate: new Date("2023-01-01").toISOString(), // Initial date
                checkedAt: new Date().toISOString(),
            }
        ]
    });

    console.log("Created project:", created.id);
    console.log("Initial Transfer Date:", created.milestones[0].transferDate);

    // 2. Mock the specific update payload that comes from the route
    const newTransferDateStr = "2023-12-25"; // New date

    // This simulates what the route.ts does before calling store.updateProjectProgress
    const updatedMilestones = created.milestones.map((m: any) => ({
        ...m,
        transferDate: new Date(newTransferDateStr).toISOString(),
        checkedAt: new Date().toISOString(),
    }));

    // 3. Update via store
    console.log("Updating with new Transfer Date:", updatedMilestones[0].transferDate);

    const updated = await store.updateProjectProgress(created.id, {
        milestones: updatedMilestones
    });

    console.log("Updated Transfer Date:", updated?.milestones[0].transferDate);

    if (updated?.milestones[0].transferDate && updated.milestones[0].transferDate.startsWith("2023-12-25")) {
        console.log("SUCCESS: Transfer date updated correctly.");
    } else {
        console.log("FAILURE: Transfer date did not update correctly.");
    }

    // Cleanup
    await store.deleteProjectProgress(created.id);

    process.exit0();
}

main().catch(console.error);
