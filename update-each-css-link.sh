#!/usr/bin/env bash
set -e
ROOT="/workspaces/Site-dreamer/Dreamer Imports"
HTML_DIR="$ROOT/html"

if [ ! -d "$HTML_DIR" ]; then
  echo "Pasta não encontrada: $HTML_DIR" >&2
  exit 1
fi

cd "$HTML_DIR"

update() {
  local file="$1"
  local css_rel="$2"
  if [ ! -f "$file" ]; then
    echo "Pular (não existe): $file"
    return
  fi

  # remove linhas com rel="stylesheet" (case-insensitive)
  sed -i '/rel=["'"'"']stylesheet["'"'"']/Id' "$file"

  # insere a tag <link> logo após a abertura do <head>
  awk -v link="<link rel=\"stylesheet\" href=\"$css_rel\">" '
    BEGIN{ins=0}
    {
      print
      if(!ins && tolower($0) ~ /<head[^>]*>/){ print link; ins=1 }
    }
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"

  echo "Atualizado: $file -> $css_rel"
}

update "index.html"      "../css/home.css"
update "listagem.html"   "../css/listagem.css"
update "acessorios.html" "../css/acessorios.css"
update "atendimento.html" "../css/atendimento.css"
update "cadastro.html"   "../css/cadastro.css"
update "calcados.html"   "../css/calcados.css"
update "carrinho.html"   "../css/carrinho.css"
update "checkout.html"   "../css/checkout.css"
update "moletom.html"    "../css/roupas.css"
update "pagamento.html"  "../css/pagamento.css"
update "quemsomos.html"  "../css/quemsomos.css"
update "roupas.html"     "../css/roupas.css"

echo "Concluído."