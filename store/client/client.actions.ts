export class GetDetailClient {
  static readonly type = '[Client] Get Detail Client';
  constructor(
    public readonly codeTypeIdntExtn: string,
    public readonly idntAgnt: string,
    public readonly idntAgntAcces: string,
    public readonly idntAgntTech: string,
    public readonly idntEtabEntt: string,
    public readonly idntExtnConx: string,
    public readonly typeCanalAcces: string,
    public readonly codeEtab: string,
    public readonly identifiantPersonne: string
  ) {}
}

export class SetClientMatricule {
  static readonly type = '[Client] Set Client Matricule';
  constructor(public readonly clientMatricule: string) {}
}
