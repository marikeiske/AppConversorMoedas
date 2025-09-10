{
  "name": "Conversion",
  "type": "object",
  "properties": {
    "from_currency": {
      "type": "string",
      "enum": [
        "BRL",
        "USD",
        "EUR"
      ],
      "description": "Moeda de origem"
    },
    "to_currency": {
      "type": "string",
      "enum": [
        "BRL",
        "USD",
        "EUR"
      ],
      "description": "Moeda de destino"
    },
    "from_amount": {
      "type": "number",
      "description": "Valor original"
    },
    "to_amount": {
      "type": "number",
      "description": "Valor convertido"
    },
    "exchange_rate": {
      "type": "number",
      "description": "Taxa de câmbio utilizada"
    },
    "conversion_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data e hora da conversão"
    }
  },
  "required": [
    "from_currency",
    "to_currency",
    "from_amount",
    "to_amount",
    "exchange_rate"
  ],
  "rls": {
    "read": {
      "created_by": "{{user.email}}"
    },
    "write": {
      "created_by": "{{user.email}}"
    }
  }
}
