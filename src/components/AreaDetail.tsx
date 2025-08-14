import { Card, Group, NumberFormatter, Stack, Title, Text, Divider } from "@mantine/core"
import { Area } from "../types";

type Props = Area

function AreaDetail({ Kode, Nama, Ibukota, LuasWilayah, JumlahPenduduk, Keterangan, jumlahKab, jumlahKec, jumlahKel }: Props) {
    const isKab = () => {
        return Kode.length > 2 ? true : false;
    }
    return (
        <Card maw={250} p={"xl"}>
            <Card.Section withBorder mb={"xs"} pb={"xs"}>
                <Title order={5}>{`${isKab() ? "" : "Provinsi"} ${Nama}`}</Title>
            </Card.Section>
            <Card.Section>
                <Stack gap={0}>
                    <Group justify='space-between'>
                        <Text size="sm">Luas Wilayah</Text>
                        <Text size="sm">
                            {LuasWilayah ? <NumberFormatter decimalScale={3} thousandSeparator="." decimalSeparator="," value={LuasWilayah} /> : "-"}
                        </Text>
                    </Group>
                    <Divider />
                    <Group justify='space-between'>
                        <Text size="sm">Kode Wilayah</Text>
                        <Text size="sm">
                            {Kode}
                        </Text>
                    </Group>
                    <Divider />
                    <Group justify='space-between'>
                        <Text size="sm">Ibu Kota</Text>
                        <Text size="sm">
                            {Ibukota}
                        </Text>
                    </Group>
                    <Divider />
                    <Group justify='space-between'>
                        <Text size="sm">Jumlah Penduduk</Text>
                        <Text size="sm">
                            {JumlahPenduduk ? <NumberFormatter thousandSeparator value={JumlahPenduduk} /> : "-"}
                        </Text>
                    </Group>
                    <Divider />
                    <Group justify='space-between'>
                        <Text size="sm">Jumlah Kabupaten</Text>
                        <Text size="sm">
                            <NumberFormatter thousandSeparator value={jumlahKab} />
                        </Text>
                    </Group>
                    <Divider />
                    <Group justify='space-between'>
                        <Text size="sm">Jumlah Kecamatan</Text>
                        <Text size="sm">
                            <NumberFormatter thousandSeparator value={jumlahKec} />
                        </Text>
                    </Group>
                    <Divider />
                    <Group justify='space-between'>
                        <Text size="sm">Jumlah Kelurahan/Desa</Text>
                        <Text size="sm">
                            <NumberFormatter thousandSeparator value={jumlahKel} />
                        </Text>
                    </Group>
                    <Divider />
                    <Group justify='space-between'>
                        <Text size="sm">Keterangan</Text>
                        <Text size="sm">
                            {Keterangan}
                        </Text>
                    </Group>
                </Stack>
            </Card.Section>
        </Card>
    )
}

export default AreaDetail