from app.graph.workflow import graph

result = graph.invoke(

    {
        "article_id": 2,
    }

)

print()

print("=" * 60)
print("GRAPH RESULT")
print("=" * 60)

print(result.keys())

print()

print(result["history"][:1200])