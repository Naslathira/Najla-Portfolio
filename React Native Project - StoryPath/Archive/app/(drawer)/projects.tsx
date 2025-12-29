import { getProjects, Project } from "@/hooks/useApi"
import { styled } from "nativewind"
import { useEffect, useState } from "react"
import { Pressable, Text, TouchableOpacity, View } from "react-native"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router } from "expo-router";
import { Button, Card, H2, Paragraph, XStack, YStack } from "tamagui";
import { ScrollView } from "react-native";

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView);


export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const proj = await getProjects();
        setProjects(proj);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <StyledView tw="flex-1 pt-10 items-center mx-5">
      <FontAwesome5 name="project-diagram" size={40} color="black" />
      <StyledScrollView tw="pt-3 w-full" contentContainerStyle={{ paddingBottom: 20 }}>
        {projects && projects.map((project) => (
          <Card key={project.id}>
            <Card.Header padded>
              <H2>{project.title}</H2>
              <Paragraph>{project.username}</Paragraph>
            </Card.Header>
            <Card.Footer padded>
              <XStack>
                <Button
                  onPress={() => {
                    router.push(`/project/${project.id}`);
                  }}
                >
                  See more
                </Button>
              </XStack>
            </Card.Footer>
          </Card>
        ))}
      </StyledScrollView>
    </StyledView>
  );
}