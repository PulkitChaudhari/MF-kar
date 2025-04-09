"use client";
import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { usePortfolioContext } from "@/app/contexts/PortfolioContext";
import { useAsyncList } from "@react-stately/data";
import { apiService } from "@/app/services/api.service";

export default function PortfolioSearchComponent({
  setIsLoading,
  isLoading,
}: {
  setIsLoading: any;
  isLoading: boolean;
}) {
  const {
    isAdjustWeightageEnabled,
    addInstrument,
    selectedTimePeriod,
    selectedInstrumentsData,
  } = usePortfolioContext();

  const handleAddInstrument = async (instrumentValue: any) => {
    setIsLoading(true);
    try {
      await addInstrument(instrumentValue, selectedTimePeriod.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const list: any = useAsyncList({
    async load({ signal, filterText }) {
      if (filterText === "") {
        return {
          items: [],
        };
      }
      let json = await apiService.searchInstruments(filterText || "");
      json = json.filter((scheme: any) => {
        const keysArr = Object.keys(selectedInstrumentsData);
        if (keysArr.length > 0)
          return !keysArr.includes(scheme.instrumentCode.toString());
        return true;
      });
      return { items: json };
    },
  });

  return (
    <Autocomplete
      inputValue={list.filterText}
      isLoading={list.isLoading}
      items={list.items}
      label="Select an instrument"
      onInputChange={list.setFilterText}
      onSelectionChange={($event) => handleAddInstrument($event)}
      menuTrigger="input"
      className="w-full"
      listboxProps={{
        emptyContent: "No results found",
      }}
      isDisabled={isAdjustWeightageEnabled || isLoading}
    >
      {(item: any) => (
        <AutocompleteItem key={item.instrumentCode} className="capitalize">
          {item.instrumentName}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
