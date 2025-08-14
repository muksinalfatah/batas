import { Card, Table, Title } from "@mantine/core"
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
        <Card p={"xl"}>
            <Card.Section withBorder mb={"xs"} pb={"xs"}>
                <Title order={5}>{properties["NAMOBJ"]}</Title>
            </Card.Section>
            <Card.Section>
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