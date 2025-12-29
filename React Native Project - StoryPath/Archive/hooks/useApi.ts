const API_BASE_URL = "https://0b5ff8b0.uqcloud.net/api";

const JWT_TOKEN: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ4Nzc4MjQifQ.ndLJADbjm9CJ_2ys-TNGQWN0jIY8sRnyE09eGpb_JRM";

const USERNAME: string = "s4877824";
import { z } from "zod"

export const projectSchema = z.object({
  description: z.string(),
  homescreen_display: z.string(),
  id: z.number(),
  initial_clue: z.string(),
  instructions: z.string(),
  is_published: z.boolean(),
  participant_scoring: z.string(),
  title: z.string(),
  username: z.string()
})

export type Project = z.infer<typeof projectSchema>

async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body: object | null = null
): Promise<any> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  };
  if (body) {
    options.body = JSON.stringify({
      ...body,
      username: USERNAME,
    });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  try {
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.log("Response is not JSON:", error);
    return response;
  }
}


export async function createProject(project: object): Promise<any> {
  return apiRequest("/project", "POST", project);
}


export async function getProjects(): Promise<Project[]> {
  const projectsData = await apiRequest("/project")
  const projects: Project[] = projectSchema.array().parse(projectsData);
  return projects
}

export async function getProject(id: string): Promise<any> {
  return apiRequest(`/project?id=eq.${id}`);
}


export async function updateProject(id: string, project: object): Promise<any> {
  return apiRequest(`/project?id=eq.${id}`, "PATCH", project);
}


export async function deleteProject(id: string): Promise<void> {
  return apiRequest(`/project?id=eq.${id}`, "DELETE");
}


export async function getLocations(projectId: string): Promise<any[]> {
  return apiRequest(`/location?project_id=eq.${projectId}`);
}

export async function getLocation(id: string): Promise<any> {
  return apiRequest(`/location?id=eq.${id}`);
}


export async function createLocation(locationData: object): Promise<any> {
  return apiRequest("/location", "POST", locationData);
}


export async function updateLocation(
  id: string,
  locationData: object
): Promise<any> {
  return apiRequest(`/location?id=eq.${id}`, "PATCH", locationData);
}

export async function deleteLocation(id: string): Promise<void> {
  return apiRequest(`/location?id=eq.${id}`, "DELETE");
}
