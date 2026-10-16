import { Card, ScrollArea, Table, Title } from "@mantine/core"
import { PROPERTIES_MAPPING } from "../const/properties"

type Props = {
    properties: Record<string, string>
}

function PropertiesDetail({ properties }: Props) {

    const renderProperties = () => {
        const items: React.ReactNode[] = []
        PROPERTIES_MAPPING.forEach(({ key, label, render }) => {
            if (properties[key]) {
                items.push(
                    <PropertiesItem key={key} name={label} value={render(properties[key])} />
                )
            }
        })

        return items;
    }

    return (
        <Card p={"xl"} w={640} maw="calc(100vw - 48px)">
            <Card.Section withBorder mb={"xs"} pb={"xs"}>
                <Title order={4}>{properties["NAMOBJ"]}</Title>
            </Card.Section>
            <Card.Section>
                <ScrollArea.Autosize mah="min(520px, 60vh)">
                <Table verticalSpacing="xs" horizontalSpacing="md" style={{ tableLayout: "fixed" }}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th w="40%">Atribut</Table.Th>
                            <Table.Th>Nilai</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {renderProperties()}
                    </Table.Tbody>
                </Table>
                </ScrollArea.Autosize>
            </Card.Section>
        </Card>
    )
}

function PropertiesItem({ name, value }: { name: string, value: string }) {
    return (
        <Table.Tr>
            <Table.Td style={{ overflowWrap: "anywhere" }}>{name}</Table.Td>
            <Table.Td style={{ overflowWrap: "anywhere" }}>{value}</Table.Td>
        </Table.Tr>
    )
}

export default PropertiesDetail
