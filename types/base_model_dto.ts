export default abstract class BaseModelDtoSerializer<T> {
  constructor(protected model: T) {}

  abstract serialize(): object
}
