"use client";
import fetchApi from "@/utils/fetchApi";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";

import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody, CardHeader } from "@heroui/card";

interface ItemTopics {
  Topic_id: number;
  Cluster: string;
  Keyword: string;
}

interface ItemSegmentasi {
  archetype_id: number;
  average_achievement: number;
  average_game_owned: number;
  average_playtime: number;
  dominant_topic: string;
}

interface ItemInterpretasi {
  arketipe: string;
  interpretasi: string;
  topik_dominan: string;
}

interface ItemMembership {
  id: number;
  Arketipe_1?: string;
  Arketipe_2?: string;
  Arketipe_3?: string;
  Arketipe_4?: string;
  Arketipe_5?: string;
}

export default function Page() {
  const { prosesId } = useParams();
  const [data, setData] = useState(null);
  const [segmentasi, setSegmentasi] = useState([]);
  const [interpretasi, setInterpretasi] = useState([]);
  const [membership, setMembership] = useState([]);
  const [topic, setTopic] = useState([]);
  const [loading, setLoading] = useState(true);
  async function getData() {
    const response = await fetchApi(`/analyze/${prosesId}`, "GET");
    if (response.status_code === 200) {
      setData(response.data);
      setTopic(response.data.topics);
      setSegmentasi(
        response.data.segmentasi_summary.karakteristik_arketipe.map(
          (row: any) => ({
            ...row,
            dominant_topic: row.dominant_topic?.keywords?.join(", ") || "", // gabung keyword jadi string
            top_3_genres: row.top_3_genres?.join(",  ") || "", // gabung keyword jadi string
          })
        )
      );
      setInterpretasi(response.data.segmentasi_summary.interpretasi_arketipe);
      setMembership(
        response.data.segmentasi_summary.membership_data.map(
          (row: any, index: number) => ({
            id: index + 1,
            Arketipe_1: row?.Arketipe_1 || "",
            Arketipe_2: row?.Arketipe_2 || "",
            Arketipe_3: row?.Arketipe_3 || "",
            Arketipe_4: row?.Arketipe_4 || "",
            Arketipe_5: row?.Arketipe_5 || "",
            Arketipe_6: row?.Arketipe_6 || "",
          })
        )
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  const columnsTopic = [
    {
      key: "Cluster",
      label: "Cluster",
    },
    {
      key: "Keyword",
      label: "Keyword",
    },
  ];

  const columnsSegmentasi = [
    {
      key: "archetype_id",
      label: "id",
    },
    {
      key: "average_achievement",
      label: "Average Achievement",
    },
    {
      key: "average_game_owned",
      label: "Average Game Owned",
    },
    {
      key: "average_playtime",
      label: "Average Playtime",
    },
    {
      key: "dominant_topic",
      label: "Dominant Topic",
    },
    {
      key: "top_3_genres",
      label: "Top 3 Genres",
    },
  ];

  const columnsInterpretasi = [
    {
      key: "arketipe",
      label: "Arketipe",
    },
    {
      key: "interpretasi",
      label: "Interpretasi",
    },
    {
      key: "topik_dominan",
      label: "Topik Dominan",
    },
  ];

  const columnsMembership = [
    {
      key: "Arketipe_1",
      label: "Arketipe 1",
    },
    {
      key: "Arketipe_2",
      label: "Arketipe 2",
    },
    {
      key: "Arketipe_3",
      label: "Arketipe 3",
    },
    {
      key: "Arketipe_4",
      label: "Arketipe 4",
    },
    {
      key: "Arketipe_5",
      label: "Arketipe 5",
    },
  ];
  return (
    <div className="max-w-8xl mx-auto min-h-screen p-10">
      <Tabs>
        <Tab key="Topic" title="Lihat Topic">
          <Card className="p-5">
            <CardHeader>
              <h2 className="text-lg font-medium">Hasil Topic Modeling</h2>
            </CardHeader>
            <CardBody>
              <Table aria-label="Topic Modeling">
                <TableHeader columns={columnsTopic}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                {loading ? (
                  <TableBody emptyContent={"No rows to display."}>
                    {[]}
                  </TableBody>
                ) : (
                  <TableBody items={topic}>
                    {(item: ItemTopics) => (
                      <TableRow key={item.Topic_id}>
                        {(columnKey) => (
                          <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                )}
              </Table>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="segmentasi" title="Lihat Segmentasi">
          <Card className="p-5">
            <CardHeader>
              <h2 className="text-lg font-medium">Hasil Segmentasi</h2>
            </CardHeader>
            <CardBody>
              <Table aria-label="Karakteristik">
                <TableHeader columns={columnsSegmentasi}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                {loading ? (
                  <TableBody emptyContent={"No rows to display."}>
                    {[]}
                  </TableBody>
                ) : (
                  <TableBody items={segmentasi}>
                    {(item: ItemSegmentasi) => (
                      <TableRow key={item.archetype_id}>
                        {(columnKey) => (
                          <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                )}
              </Table>

              <h1 className="my-2 mt-10">Interpretasi Segmentasi</h1>
              <Table aria-label="Interpretasi">
                <TableHeader columns={columnsInterpretasi}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                {loading ? (
                  <TableBody emptyContent={"No rows to display."}>
                    {[]}
                  </TableBody>
                ) : (
                  <TableBody items={interpretasi}>
                    {(item: ItemInterpretasi) => (
                      <TableRow key={item.arketipe}>
                        {(columnKey) => (
                          <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                )}
              </Table>
              <h1 className="my-2 mt-10">Anggota Arketipe</h1>
              <Table aria-label="Membership">
                <TableHeader columns={columnsMembership}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                {loading ? (
                  <TableBody emptyContent={"No rows to display."}>
                    {[]}
                  </TableBody>
                ) : (
                  <TableBody items={membership}>
                    {(item: ItemMembership) => (
                      <TableRow key={item.id}>
                        {(columnKey) => (
                          <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                )}
              </Table>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
