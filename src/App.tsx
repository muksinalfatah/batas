import { AspectRatio, Box, Center, Group, Image, Paper, Select, Stack, Tabs, Title } from "@mantine/core"
import Map, { MapMode } from "./Map"
import { useMemo, useState } from "react"
import { IAreaService } from "./types/services"
import { AreaServiceFactory } from "./services/AreaService"
import logo from './assets/logo.png'

function App() {

  const [selectedTab, setSelectedTab] = useState("area-code")
  const [version, setVersion] = useState("v1");

  const map = useMemo(() => {
    const areaService: IAreaService = AreaServiceFactory.createAreaService(selectedTab, "");
    let title;
    let mode: MapMode = MapMode.AREA;
    switch (selectedTab) {
      case "area-code":
        title = "Peta Kode Wilayah"
        break;
      case "area-boundry":
        title = "Peta Batas"
        mode = MapMode.LINE;
        break;
      default:
        break;
    }
    return <Map key={`${selectedTab}-${version}`} mode={mode} title={title} areaService={areaService} />
  }, [selectedTab, version])

  return (
    <Stack bg={"#173261"} p={{ base: "sm", md: "xl" }}>
      <Stack>
        <Group justify="center">
          <Image src={logo} alt="Logo" h={100} w="auto" />
        </Group>
        <Title c={"white"} ta={"center"}>Portal Peta Wilayah</Title>
      </Stack>
      <Box p={{ base: 0, md: "xl" }}>
        <Paper p={"md"} pos={"relative"} px={{ base: 50, sm: "xs" }} radius={10} shadow="md">
          <Stack>
            <Tabs value={selectedTab} onChange={(val) => setSelectedTab(val ?? "gallery")}>
              <Group justify="space-between">
                <Tabs.List>
                  <Tabs.Tab value="area-code" >
                    Peta Kode Wilayah
                  </Tabs.Tab>
                  <Tabs.Tab value="area-boundry" >
                    Peta Batas
                  </Tabs.Tab>
                </Tabs.List>
                <Select
                  label="Versi"
                  size="sm"
                  value={version}
                  onChange={value => (value !== null) ? setVersion(value) : null}
                  placeholder="Pilih Versi"
                  data={['v1']}
                />
              </Group>
            </Tabs>
            <Center>
              <AspectRatio ratio={2 / 1} w={"100%"}>
                {map}
              </AspectRatio>
            </Center>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  )
}

export default App
