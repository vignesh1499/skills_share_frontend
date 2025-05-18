import { Skill } from "../types/skill.types";

export const defaultValues: Skill = {
  id: undefined,                 
  providerId: undefined,               
  userId: undefined,                   
  category: '',                 
  experience: 0,                
  nature_of_work: 'onsite',     
  hourly_rate: 0,               
  status: null,                  
  completion: false,            
  approval: false,              
};