"use client";
import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function PortfolioSearchComponent({
  list,
  addInstrument,
  isAdjustWeightageEnabled,
  isLoading,
}: {
  list: any;
  addInstrument: any;
  isAdjustWeightageEnabled: any;
  isLoading: any;
}) {
  return (
    <Autocomplete
      inputValue={list.filterText}
      isLoading={list.isLoading}
      items={list.items}
      label="Select an instrument"
      onInputChange={list.setFilterText}
      onSelectionChange={($event) => addInstrument($event)}
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
