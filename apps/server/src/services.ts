import { AttributeService } from "@domain";

export type Services = {
  attributeService: typeof AttributeService;
};

export const services = {
  attributeService: AttributeService,
};
