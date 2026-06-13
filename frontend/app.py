import requests
import streamlit as st


st.set_page_config(
    page_title="Intelligent Bridge - AI Returns Dashboard",
    page_icon="🔄",
    layout="wide",
)

st.markdown(
    """
    <style>
        .stApp {
            background:
                radial-gradient(circle at 8% 4%, rgba(17, 109, 92, 0.10), transparent 26%),
                radial-gradient(circle at 92% 12%, rgba(219, 147, 29, 0.12), transparent 30%),
                linear-gradient(160deg, #e8f0f3 0%, #f8f4ec 52%, #eef5eb 100%);
            color: #11212a;
        }
        .main .block-container {
            max-width: 1200px;
            padding-top: 1.2rem;
            padding-bottom: 2rem;
        }
        .stApp, .stApp p, .stApp div, .stApp span, .stApp label {
            font-family: "Trebuchet MS", "Segoe UI", sans-serif;
        }
        section[data-testid="stSidebar"] {
            background: linear-gradient(180deg, #112736 0%, #173448 100%);
            border-right: 1px solid rgba(255, 255, 255, 0.12);
            color: #f2efe8;
        }
        section[data-testid="stSidebar"] * {
            color: #f2efe8;
        }
        .ib-hero {
            padding: 1.45rem 1.5rem;
            border-radius: 1.25rem;
            background: linear-gradient(145deg, rgba(10, 33, 45, 0.94), rgba(23, 69, 86, 0.90));
            color: #f4f1eb;
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 18px 45px rgba(14, 26, 33, 0.18);
            margin-bottom: 1.1rem;
            overflow-wrap: anywhere;
        }
        .ib-hero h1 {
            margin: 0;
            font-size: 2.1rem;
            letter-spacing: -0.02em;
            line-height: 1.08;
        }
        .ib-hero p {
            margin: 0.5rem 0 0;
            color: rgba(244, 241, 235, 0.84);
            font-size: 1rem;
            line-height: 1.35;
        }
        .ib-chip-row {
            margin-top: 0.75rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
        }
        .ib-chip {
            display: inline-flex;
            align-items: center;
            padding: 0.24rem 0.62rem;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.28);
            background: rgba(255, 255, 255, 0.09);
            font-size: 0.79rem;
            letter-spacing: 0.01em;
        }
        div[data-testid="stMetric"] {
            background: rgba(255, 255, 255, 0.82);
            border: 1px solid rgba(17, 33, 42, 0.11);
            padding: 0.85rem 0.92rem;
            border-radius: 1rem;
            box-shadow: 0 10px 28px rgba(15, 34, 44, 0.07);
            min-height: 96px;
        }
        div[data-testid="stMetricValue"] {
            font-weight: 700;
            line-height: 1.1;
        }
        div[data-testid="stDataFrame"] {
            border-radius: 1rem;
            overflow: hidden;
            border: 1px solid rgba(15, 34, 44, 0.12);
            box-shadow: 0 12px 34px rgba(15, 34, 44, 0.07);
        }
        h1, h2, h3, h4 {
            color: #11212a;
            letter-spacing: -0.01em;
        }
        @media (max-width: 980px) {
            .main .block-container {
                padding-top: 0.9rem;
                padding-left: 1rem;
                padding-right: 1rem;
            }
            .ib-hero {
                padding: 1.1rem;
            }
            .ib-hero h1 {
                font-size: 1.62rem;
            }
            .ib-hero p {
                font-size: 0.92rem;
            }
            div[data-testid="stMetric"] {
                min-height: 86px;
            }
        }
    </style>
    """,
    unsafe_allow_html=True,
)

BACKEND_URL = "http://127.0.0.1:8000"


def fetch_history():
    try:
        response = requests.get(f"{BACKEND_URL}/api/history", timeout=5)
        response.raise_for_status()
        payload = response.json()
        return payload.get("history", []), True, None
    except Exception as exc:
        return [], False, str(exc)


def process_with_backend(uploaded_file, return_reason):
    files = {"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
    data = {"return_reason": return_reason}
    response = requests.post(f"{BACKEND_URL}/api/grade", files=files, data=data, timeout=60)
    response.raise_for_status()
    return response.json()


def summarize_history(history_items):
    total_processed = len(history_items)
    total_recovered_value = 0.0
    fraud_incidents = 0
    confidence_sum = 0.0

    for item in history_items:
        if item.get("is_fraud") == 1:
            fraud_incidents += 1
        total_recovered_value += (item.get("value_recovery", 0) / 100) * 120
        confidence_sum += float(item.get("confidence_score", 0) or 0)

    average_confidence = confidence_sum / total_processed if total_processed else 0.0
    average_recovery = (
        sum(float(item.get("value_recovery", 0) or 0) for item in history_items) / total_processed
        if total_processed
        else 0.0
    )

    return {
        "total_processed": total_processed,
        "total_recovered_value": total_recovered_value,
        "fraud_incidents": fraud_incidents,
        "average_confidence": average_confidence,
        "average_recovery": average_recovery,
    }


def format_history_rows(history_items):
    rows = []
    for item in history_items:
        rows.append(
            {
                "Timestamp": item.get("timestamp"),
                "Product Name": item.get("product_name"),
                "Category": item.get("category"),
                "AI Condition Grade": item.get("grade"),
                "Fraud Flag": "🔴 SUSPECTED" if item.get("is_fraud") == 1 else "🟢 Clean",
                "Recommended Route": item.get("recommended_route"),
                "Value Recovery": f"{item.get('value_recovery', 0)}%",
                "Grading Insights": item.get("grading_justification"),
            }
        )
    return rows


def ensure_session_defaults():
    if "latest_result" not in st.session_state:
        st.session_state["latest_result"] = None


def render_result_card(result, backend_url):
    data_payload = result["data"]

    if result.get("image_url"):
        image_url = f"{backend_url}{result['image_url']}"
        st.image(image_url, caption="Inspected Item Capture", width="stretch")

    st.subheader(f"🏷️ Product: {data_payload['product_name']}")
    st.caption(f"Category: {data_payload['detected_category']}")

    grade = data_payload["grade"]
    if "Grade A" in grade or "Grade B" in grade:
        st.success(f"Condition Status: {grade} (Confidence: {data_payload['confidence_score']:.2%})")
    else:
        st.error(f"Condition Status: {grade} (Confidence: {data_payload['confidence_score']:.2%})")

    if data_payload["is_fraud_suspected"]:
        st.error("🚨 Critical alert: potential return fraud or swap detected.")
    else:
        st.info("🛡️ Fraud check passed: the item appears consistent with the order record.")

    st.write(f"**Justification:** {data_payload['grading_justification']}")
    st.markdown("### 🗺️ Circular Economy Routing Target")
    st.info(
        f"Target Destination: {data_payload['recommended_route']} "
        f"({data_payload['estimated_value_recovery_percentage']}% value recovery target)"
    )
    st.write(f"**Routing Logic:** {data_payload['routing_reasoning']}")


history_items, backend_available, backend_error = fetch_history()

summary = summarize_history(history_items)
ensure_session_defaults()

if backend_available:
    st.sidebar.success("Live backend connected")
else:
    st.sidebar.error("Backend unavailable")
    st.sidebar.caption(f"Last connection error: {backend_error}")

with st.sidebar:
    st.markdown("### Live flow")
    st.write("1. Upload a real return image.")
    st.write("2. Submit with the customer return reason.")
    st.write("3. Review the live verdict and ledger history.")

st.markdown(
    """
    <div class="ib-hero">
        <h1>Intelligent Bridge</h1>
        <p>AI grading, fraud detection, and circular routing for returned products from one clean operator console.</p>
        <div class="ib-chip-row">
            <span class="ib-chip">Computer Vision Grading</span>
            <span class="ib-chip">Fraud Signal Check</span>
            <span class="ib-chip">Circular Route Recommendation</span>
        </div>
    </div>
    """,
    unsafe_allow_html=True,
)

col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("Total Returns Processed", f"{summary['total_processed']} units")
with col2:
    st.metric("Estimated Value Recovered", f"${summary['total_recovered_value']:,.2f}", delta="Optimized route")
with col3:
    st.metric("Fraud Interceptions", f"{summary['fraud_incidents']} flagged", delta="- losses", delta_color="inverse")
with col4:
    st.metric("Average Confidence", f"{summary['average_confidence']:.0%}", delta=f"{summary['average_recovery']:.0f}% recovery")

st.markdown("---")

left_column, right_column = st.columns([1, 1.2])

with left_column:
    st.header("📥 Item Intake Center")
    st.write("Upload a real return image to run the grading pipeline against the live backend.")

    return_reason = st.selectbox(
        "Stated Return Reason (from customer)",
        [
            "Changed my mind / Don't want it",
            "Box was open, didn't like color",
            "Item looks damaged or scuffed",
            "Defective, does not turn on",
            "Incorrect item arrived",
        ],
    )

    uploaded_file = st.file_uploader("Drop product image here...", type=["jpg", "jpeg", "png"])

    if st.button("Run live grading", width="stretch"):
        if uploaded_file is not None:
            if not backend_available:
                st.error("Backend is not reachable. Start the FastAPI server before grading.")
            else:
                with st.spinner("Analyzing item texture, fraud vectors, and routing logic..."):
                    try:
                        st.session_state["latest_result"] = process_with_backend(uploaded_file, return_reason)
                        st.success("Analysis complete.")
                        st.rerun()
                    except Exception as exc:
                        st.error(f"Failed to connect to API: {exc}")
        else:
            st.warning("Please upload an image file first.")

    st.markdown("### Product trust layer")
    st.info("Every processed item gets a history card showing grade, fraud flag, and recommended downstream route.")

with right_column:
    st.header("🔍 Real-Time AI Verdict")

    latest_result = st.session_state.get("latest_result")
    if latest_result:
        render_result_card(latest_result, BACKEND_URL)
    else:
        st.info("Waiting for an intake submission. Upload a real image on the left to run grading.")

st.markdown("---")

st.header("📋 Warehouse Return Ledger History")
st.write("This log shows processed return records from your live backend and database.")

if history_items:
    st.dataframe(format_history_rows(history_items), width="stretch")
else:
    st.write("No historical entries processed yet.")
