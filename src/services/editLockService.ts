import EditLock, { IEditLock } from '../models/edit-locks';

export class EditLockService {
    create = async (eventId: string): Promise<IEditLock> => {
        return await EditLock.create({ eventId });
    };

    getByUser = async (userId: string): Promise<IEditLock | null> => {
        const result = await EditLock.findOne({ userId: userId }).lean();
        return result;
    };

    requestEdit = async (userId: string, eventId: string) => {
        const editLock = await EditLock.findOne({ eventId });

        if (!editLock) throw new Error('Edit lock not found');

        if (editLock.expire > Date.now()) {
            throw new Error("You can't edit this event because someone else is editing it.");
        }

        const expireTime = Date.now() + 5 * 60 * 1000;

        editLock.editable = true;
        editLock.userId = userId;
        editLock.expire = expireTime;

        await editLock.save();

        return editLock;
    };

    releaseEdit = async (userId: string, eventId: string) => {
        const editLockFound = await EditLock.findOne({ userId, eventId });

        if (!editLockFound) throw new Error('Edit lock not found');

        if (editLockFound.userId.toString() !== userId)
            throw new Error("You can't release edit with this event");

        editLockFound.editable = false;
        editLockFound.userId = '';
        editLockFound.expire = 0;

        await editLockFound.save();

        return editLockFound;
    };

    maintainEdit = async (userId: string, eventId: string) => {
        const editLockFound = await EditLock.findOne({ userId, eventId });

        if (!editLockFound) throw new Error('Edit lock not found');

        if (editLockFound.userId !== userId)
            throw new Error("You can't maintain this edit session");

        const expireTime = Date.now() + 1 * 30 * 1000;

        editLockFound.expire = expireTime;

        await editLockFound.save();

        return editLockFound;
    };
}
