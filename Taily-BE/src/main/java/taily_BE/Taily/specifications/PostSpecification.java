package taily_BE.Taily.specifications;

import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import taily_BE.Taily.entities.Post;
import taily_BE.Taily.entities.enums.Age;
import taily_BE.Taily.entities.enums.Sex;
import taily_BE.Taily.entities.enums.Size;

import java.time.LocalDateTime;

public class PostSpecification {

    public static Specification<Post> allowedSexEquals(Sex sex) {
        return (root, query, builder) -> {
            if (sex == null) {
                return builder.conjunction();
            }
            return builder.equal(root.get("allowedSex"), sex);
        };
    }

    public static Specification<Post> allowedSizeEquals(Size size) {
        return (root, query, builder) -> {
            if (size == null) {
                return builder.conjunction();
            }
            return builder.equal(root.get("allowedSize"), size);
        };
    }

    public static Specification<Post> allowedAgeEquals(Age age) {
        return (root, query, builder) -> {
            if (age == null) {
                return builder.conjunction();
            }
            return builder.equal(root.get("allowedAge"), age);
        };
    }

    public static Specification<Post> provinciaEquals(String siglaProvincia) {
        return (root, query, builder) -> {
            if (siglaProvincia == null || siglaProvincia.isEmpty()) {
                return builder.conjunction();
            }
            // Join per arrivare alla provincia tramite: Post -> Comune -> Provincia
            Join<Object, Object> comuneJoin = root.join("district");
            Join<Object, Object> provinciaJoin = comuneJoin.join("provincia");

            return builder.equal(builder.upper(provinciaJoin.get("siglaProvincia")),
                    siglaProvincia.toUpperCase());
        };
    }

    public static Specification<Post> dateAfter(LocalDateTime date) {
        return (root, query, builder) -> {
            if (date == null) {
                return builder.conjunction();
            }
            return builder.greaterThanOrEqualTo(root.get("date"), date);
        };
    }
}
