FROM python:3.14

WORKDIR /app

RUN pip install uv

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen

COPY . .

EXPOSE 8000

CMD ["uv", "run", "daphne", "-b", "0.0.0.0", "-p", "8000", "config.asgi:application"]
