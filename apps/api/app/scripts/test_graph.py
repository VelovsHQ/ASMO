from app.graph.workflow import graph

result = graph.invoke(

    {
        "article_id": 1,
    }

)

print(result)