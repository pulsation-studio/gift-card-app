export enum CardStatus {
  Available = 'Available',
  Empty = 'Empty',
  Expired = 'Expired',
  SendingFailed = 'SendingFailed',
}

export const CardStatusLabel = {
  [CardStatus.Available]: 'Disponible',
  [CardStatus.Empty]: 'Vide',
  [CardStatus.Expired]: 'Expirée',
  [CardStatus.SendingFailed]: "Échec de l'envoi",
}
