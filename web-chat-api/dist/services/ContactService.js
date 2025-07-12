import ContactRelationship from "@/enums/ContactRelationship.enum.js";
import Contact from "@/models/Contact.model.js";
import { toObjectId } from "@/utils/mongoose.js";
class ContactService {
    constructor() {
        this.getContacts = async ({ userId, first = 10, after, }) => {
            const filter = {
                [`relationships.${userId}`]: { $eq: ContactRelationship.connected },
            };
            if (after) {
                filter._id = { $lt: toObjectId(after) };
            }
            const docs = await Contact.find(filter)
                .populate("users")
                .sort({ createdAt: -1 })
                .limit(first + 1);
            const hasNextPage = docs.length > first;
            const sliced = hasNextPage ? docs.slice(0, first) : docs;
            const edges = sliced.map((doc) => ({
                cursor: doc._id.toString(),
                node: doc,
            }));
            return {
                edges,
                pageInfo: {
                    startCursor: edges.length ? edges[0].cursor : null,
                    hasNextPage,
                    endCursor: edges.length ? edges[edges.length - 1].cursor : null,
                },
            };
        };
    }
}
const contactService = new ContactService();
export default contactService;
