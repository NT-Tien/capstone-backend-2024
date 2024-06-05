import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, Repository } from "typeorm"
import { TaskItemEntity } from "../task-item.entity"
import { TypeErrorEntity } from "../type-error.entity";

@EventSubscriber()
export class TypeErrorCountSubscriber implements EntitySubscriberInterface {

    constructor(
        private readonly typeErrorRepository: Repository<TypeErrorEntity>
    ) {}

    /**
     * Called before entity insertion.
     */
    async beforeInsert(event: InsertEvent<TaskItemEntity>) {
        console.log(`BEFORE ENTITY INSERTED: `, event.entity)
        const taskItem = event.entity;
        const typeError = taskItem.typeError;
        if (typeError) {
            typeError.incrementCount(); // Increment the count
            await this.typeErrorRepository.save(typeError); // Save TypeErrorEntity to update count in the database
        }
    }

    /**
     * Called after entity remove.
     */
    async afterRemove(event: RemoveEvent<TaskItemEntity>) {
        console.log(`AFTER ENTITY REMOVED: `, event.entity)
        const taskItem = event.entity;
        const typeError = taskItem.typeError;
        if (typeError) {
            typeError.decrementCount(); // Decrement the count
            await this.typeErrorRepository.save(typeError); // Save TypeErrorEntity to update count in the database
        }
    }

   
}