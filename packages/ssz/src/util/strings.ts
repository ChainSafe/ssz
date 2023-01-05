// Convert camelCase strings to various other formats  -- assumes input field is camelCase or camel1Case

export const Case = {
  snake: (field: string): string =>
    field
      .replaceAll(/[^0-z]/g, "")
      .replaceAll(/[a-z][A-Z]|[0-9][A-Z]/g, (substr) => substr[0] + "_" + substr[1].toLowerCase()),
  constant: (field: string): string =>
    field
      .replaceAll(/[^0-z]/g, "")
      .replaceAll(/[a-z][A-Z]|[0-9][A-Z]/g, (substr) => substr[0] + "_" + substr[1])
      .toUpperCase(),
  pascal: (field: string): string => {
    const first = field[0].toUpperCase();
    return (first + field.slice(1)).replaceAll(/[^0-z]/g, "");
  },
  camel: (field: string): string => {
    return field[0].toLowerCase() + field.slice(1);
  },
  header: (field: string): string => {
    const first = field[0].toUpperCase();
    return (
      first +
      field
        .slice(1)
        .replaceAll(/[^0-z]/g, "")
        .replaceAll(/[a-z][A-Z]|[0-9][A-Z]/g, (substr) => substr[0] + "-" + substr[1])
    );
  },
  eth2: (field: string): string => Case.snake(field),
};
