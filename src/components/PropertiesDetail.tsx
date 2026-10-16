import { Card, ScrollArea, Table, Title } from "@mantine/core"
import { PROPERTIES_MAPPING } from "../const/properties"

type Props = {
    properties: Record<string, string>
}

function PropertiesDetail({ properties }: Props) {

    const renderProperties = () => {
        const items: React.ReactNode[] = []
        PROPERTIES_MAPPING.forEach(({ key, label, render }) => {
            if (properties[key] != null && String(properties[key]).trim() !== "") {
                items.push(
                    <PropertiesItem key={key} name={label} value={render(String(properties[key]))} />
                )
            }
        })
        const mappedKeys = new Set(PROPERTIES_MAPPING.map(item => item.key));
        Object.entries(properties).forEach(([key, value]) => {
            if (!mappedKeys.has(key) && key !== "NAMOBJ" && value != null && String(value).trim() !== "") {
                items.push(<PropertiesItem key={key} name={key} value={String(value)} />);
            }
        });

        return items;
    }

    return (
        <Card p={"xl"} maw={450}>
            <Card.Section withBorder mb={"xs"} pb={"xs"}>
                <Title order={5}>{properties["NAMOBJ"]}</Title>
            </Card.Section>
            <Card.Section>
                <ScrollArea.Autosize mah={320}>
                <Table verticalSpacing={0}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Properties</Table.Th>
                            <Table.Th>Values</Table.Th>
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
            <Table.Td>{name}</Table.Td>
            <Table.Td>{value}</Table.Td>
        </Table.Tr>
    )
}

export default PropertiesDetail
