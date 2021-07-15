import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import relationships from "../api/routes/users/me/relationships";
import Relationship, {
  Type as RelationshipType,
} from "../entities/Relationship";
import User from "../entities/User";
import RelationshipRepository from "../repositories/RelationshipRepository";

@Service()
export default class RelationshipService {
  constructor(
    @InjectRepository()
    private readonly repository: RelationshipRepository
  ) {}

  async all(user: User) {
    return this.repository.findAllByUser(user);
  }

  async findRelationship(user: User, peer: User) {
    return await this.repository.findByUserAndPeer(user, peer);
  }

  async findRelationships(user: User, peer: User) {
    const a = await this.repository.findByUserAndPeer(user, peer);
    const b = await this.repository.findByUserAndPeer(peer, user);

    return [a, b];
  }

  async accept(a: Relationship, b: Relationship) {
    a.type = RelationshipType.FRIEND;
    b.type = RelationshipType.FRIEND;

    await this.repository.save(a);
    await this.repository.save(b);
  }

  async block(a: Relationship, b: Relationship) {
    a.type = RelationshipType.BLOCK;

    await this.repository.save(a);
    await this.repository.delete(b);
  }

  async ask(user: User, peer: User) {
    const a = new Relationship();
    a.user = user;
    a.peer = peer;
    a.type = RelationshipType.OUTCOMING;

    const b = new Relationship();
    b.user = peer;
    b.peer = user;
    b.type = RelationshipType.INCOMING;

    await this.repository.save(a);
    await this.repository.save(b);

    return [a, b];
  }

  async blockUser(user: User, peer: User) {
    const a = new Relationship();
    a.user = user;
    a.peer = peer;
    a.type = RelationshipType.BLOCK;

    await this.repository.save(a);

    return a;
  }

  async delete(relationship: Relationship) {
    await this.repository.delete(relationship);
  }
}
